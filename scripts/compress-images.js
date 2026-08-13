/**
 * 文章圖片壓縮
 *
 * 用 pngquant 把 source/_posts/ 底下未壓縮的 PNG 轉成 palette PNG。
 * UI 截圖大多是大片純色，實測可以省 80% 以上，肉眼看不出差別。
 *
 * 為什麼需要這支：npm run images:process 只是讀圖片長寬寫進
 * image_dimensions.json，不碰檔案內容；build 流程也不壓縮。
 * 在這之前壓縮全靠人記得手動跑，所以會漏。
 *
 * 用法：
 *   npm run images:compress                        壓縮 source/_posts/ 全部
 *   npm run images:compress -- n8n-update-log      只壓某篇文章的圖
 *   npm run images:compress -- --dry               只列出待壓清單，不改檔案
 *
 * 重複執行是安全的：已經是 palette 的 PNG 會被跳過，不會反覆有損壓縮。
 *
 * 一次全壓之前先跑 --dry 看清單。含漸層的 infographic（非 UI 截圖）壓成
 * palette 可能出現色帶，那類圖建議個別確認過再壓。
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { glob } = require('glob');

const POSTS_DIR = path.join(__dirname, '../source/_posts');
const QUALITY = '65-85';

/**
 * 讀 PNG 的 IHDR 判斷是否已經壓過。
 *
 * PNG 檔頭固定佈局：8 bytes 簽章 + 4 length + 4 "IHDR" + 4 width + 4 height
 * + 1 bit depth + 1 color type，所以 color type 固定在 offset 25。
 * 值 3 代表 palette（pngquant 的產物），0/2/4/6 是 gray/RGB/gray+alpha/RGBA。
 *
 * 用檔頭而不是呼叫 file 指令：快，而且不必解析不同系統的文字輸出格式。
 */
function isPalettePng(filePath) {
  const buffer = Buffer.alloc(26);
  const fd = fs.openSync(filePath, 'r');
  try {
    if (fs.readSync(fd, buffer, 0, 26, 0) < 26) {
      return false;
    }
  } finally {
    fs.closeSync(fd);
  }
  if (buffer.toString('latin1', 1, 4) !== 'PNG') {
    return false;
  }
  return buffer[25] === 3;
}

function hasPngquant() {
  try {
    execFileSync('pngquant', ['--version'], { stdio: 'ignore' });
    return true;
  } catch (err) {
    return false;
  }
}

const toKB = bytes => Math.round(bytes / 1024);

async function main() {
  const dryRun = process.argv.includes('--dry');

  if (!dryRun && !hasPngquant()) {
    console.error('[Compress] 找不到 pngquant，請先安裝：brew install pngquant');
    process.exit(1);
  }

  // 第一個非 flag 參數當作子目錄，用來把範圍限縮到單篇文章
  const scope = process.argv.slice(2).find(arg => !arg.startsWith('--'));
  const pattern = scope ? `${scope}/**/*.png` : '**/*.png';

  const files = await glob(pattern, { cwd: POSTS_DIR, absolute: true });
  if (files.length === 0) {
    console.error(`[Compress] 在 source/_posts/${scope || ''} 找不到 PNG`);
    process.exit(1);
  }

  const targets = files.filter(file => !isPalettePng(file));
  const label = scope ? `source/_posts/${scope}` : 'source/_posts';

  if (targets.length === 0) {
    console.log(`[Compress] ${label} 的 ${files.length} 張 PNG 全部壓縮過了，沒有待處理的檔案`);
    return;
  }

  const totalBefore = targets.reduce((sum, file) => sum + fs.statSync(file).size, 0);
  console.log(`[Compress] ${label}：${files.length} 張 PNG 中有 ${targets.length} 張未壓縮，共 ${toKB(totalBefore)}KB`);

  if (dryRun) {
    targets
      .map(file => ({ file, size: fs.statSync(file).size }))
      .sort((left, right) => right.size - left.size)
      .forEach(({ file, size }) => {
        console.log(`  ${String(toKB(size)).padStart(6)}KB  ${path.relative(POSTS_DIR, file)}`);
      });
    console.log('[Compress] --dry 模式，未修改任何檔案');
    return;
  }

  let done = 0;
  let skipped = 0;
  let totalAfter = 0;

  targets.forEach(file => {
    // 先壓到暫存檔，確認成功而且真的變小才取代原圖。
    // pngquant 對顏色已經很少的圖可能壓不動（exit 99），那種情況保留原圖。
    const tmpFile = path.join(os.tmpdir(), `compress-${process.pid}-${done}.png`);
    const before = fs.statSync(file).size;

    try {
      execFileSync('pngquant', [
        '--quality', QUALITY,
        '--speed', '1',
        '--force',
        '--output', tmpFile,
        file
      ], { stdio: 'ignore' });
    } catch (err) {
      skipped++;
      totalAfter += before;
      console.log(`  跳過（壓不動）  ${path.relative(POSTS_DIR, file)}`);
      return;
    }

    const after = fs.statSync(tmpFile).size;
    if (after >= before) {
      fs.unlinkSync(tmpFile);
      skipped++;
      totalAfter += before;
      console.log(`  跳過（沒變小）  ${path.relative(POSTS_DIR, file)}`);
      return;
    }

    fs.copyFileSync(tmpFile, file);
    fs.unlinkSync(tmpFile);
    totalAfter += after;
    done++;
    console.log(`  ${String(toKB(before)).padStart(6)}KB → ${String(toKB(after)).padStart(5)}KB  ${path.relative(POSTS_DIR, file)}`);
  });

  const saved = totalBefore - totalAfter;
  console.log(
    `[Compress] 壓縮 ${done} 張、跳過 ${skipped} 張，`
    + `${toKB(totalBefore)}KB → ${toKB(totalAfter)}KB，省下 ${toKB(saved)}KB`
    + `（${Math.round(saved * 100 / totalBefore)}%）`
  );
  console.log('[Compress] 圖片尺寸沒變，不需要重跑 images:process');
}

if (require.main === module) {
  main().catch(err => {
    console.error('[Compress] 執行失敗:', err);
    process.exit(1);
  });
}

module.exports = main;
