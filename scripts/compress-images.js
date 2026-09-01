/**
 * 文章圖片壓縮
 *
 * PNG：用 pngquant 轉成 palette PNG（有損）。UI 截圖大多是大片純色，
 * 實測可以省 80% 以上，肉眼看不出差別。
 *
 * JPG：用 mozjpeg 的 jpegtran 做無損最佳化（重算 Huffman 表、轉 progressive、
 * 丟掉 EXIF）。像素一個都不動，只是把同樣的資料編得更省。
 *
 * 為什麼需要這支：npm run images:process 只是讀圖片長寬寫進
 * image_dimensions.json，不碰檔案內容；build 流程也不壓縮。
 * 在這之前壓縮全靠人記得手動跑，所以會漏。
 *
 * 為什麼 JPG 只做無損（2026-09-01 全站 177 張 / 16.29MB 實測）：
 *   mozjpeg jpegtran 無損                        省 1.55MB（10%）
 *   jpeg-recompress --accurate --method ssim     省 1.57MB（10%）← 有損
 *   ImageMagick 重壓 q82                          省 2.04MB（13%）← 有損
 *   ImageMagick 重壓 q90                          反而多 1.00MB（+6%）
 * 有損只多省 0.02MB 就要賠上不可逆的畫質，不值得。重壓到 q90 之所以是負的，
 * 是因為這個圖庫平均已經 q87（q90 有 83 張、q94 有 46 張）。
 *
 * 🔴 JPG 一定要用 mozjpeg 那支 jpegtran，不是 PATH 上 libjpeg-turbo 的同名指令。
 * 同一批圖 mozjpeg 省 10%、libjpeg-turbo 只省 5%，兩者都是真無損。找不到
 * mozjpeg 就直接報錯，不默默退回 turbo 版少省一半。
 *
 * 用法：
 *   npm run images:compress                        壓縮 source/_posts/ 全部
 *   npm run images:compress -- n8n-update-log      只壓某篇文章的圖
 *   npm run images:compress -- --dry               只列出待壓清單，不改檔案
 *   npm run images:compress -- --min-kb=200        只壓 200KB 以上的圖
 *
 * 重複執行是安全的：
 *   PNG 已經是 palette 的直接跳過，不會反覆有損壓縮。
 *   JPG 每次都重跑一次 jpegtran——無損沒有累積劣化的問題，而且第二次起輸出
 *   會跟原檔一樣大，被下面「沒變小就保留原圖」擋掉。實測連跑三輪 md5 不變。
 *
 * 一次全壓之前先跑 --dry 看清單。含漸層的 infographic（非 UI 截圖）壓成
 * palette 可能出現色帶，那類圖建議個別確認過再壓。
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const { glob } = require('glob');

const POSTS_DIR = path.join(__dirname, '../source/_posts');
const QUALITY = '65-85';

// mozjpeg 是 keg-only，brew 不會把它 symlink 進 PATH，所以要自己找。
// 順序：環境變數 > Apple Silicon 的 brew > Intel Mac 的 brew。
const MOZJPEG_CANDIDATES = [
  process.env.MOZJPEG_JPEGTRAN,
  '/opt/homebrew/opt/mozjpeg/bin/jpegtran',
  '/usr/local/opt/mozjpeg/bin/jpegtran',
].filter(Boolean);

/**
 * 讀 PNG 的 IHDR 取出 color type，副檔名是 .png 但內容不是 PNG 的回傳 null。
 *
 * PNG 檔頭固定佈局：8 bytes 簽章 + 4 length + 4 "IHDR" + 4 width + 4 height
 * + 1 bit depth + 1 color type，所以 color type 固定在 offset 25。
 * 值 3 代表 palette（pngquant 的產物），0/2/4/6 是 gray/RGB/gray+alpha/RGBA。
 *
 * 用檔頭而不是呼叫 file 指令：快，而且不必解析不同系統的文字輸出格式。
 *
 * 一定要區分「不是 PNG」和「是 PNG 但沒壓過」：本站有副檔名叫 .png、
 * 實際是 WebP 的檔案（the_martech_handbook/martech_talent.png），
 * 把它算進待壓清單只會讓統計多一張、然後在 pngquant 那裡失敗。
 */
function pngColorType(filePath) {
  const buffer = Buffer.alloc(26);
  const fd = fs.openSync(filePath, 'r');
  try {
    if (fs.readSync(fd, buffer, 0, 26, 0) < 26) {
      return null;
    }
  } finally {
    fs.closeSync(fd);
  }
  if (buffer.toString('latin1', 1, 4) !== 'PNG') {
    return null;
  }
  return buffer[25];
}

function hasPngquant() {
  try {
    execFileSync('pngquant', ['--version'], { stdio: 'ignore' });
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * 找 mozjpeg 版的 jpegtran，找不到回傳 null。
 *
 * 只認 -version 講得出 mozjpeg 的那支。PATH 上通常也有一支同名的 jpegtran
 * （libjpeg-turbo 帶的），跑得動但只省一半，收下去就是靜默降級。
 *
 * -version 寫的是 stderr 不是 stdout，所以用 spawnSync 兩邊都撈；
 * 路徑不存在時 spawnSync 也不會丟例外，看 error/status 就好。
 */
function findMozjpegTran() {
  for (const bin of MOZJPEG_CANDIDATES) {
    const res = spawnSync(bin, ['-version'], { encoding: 'utf8' });
    if (!res.error && res.status === 0 && /mozjpeg/i.test(`${res.stdout}${res.stderr}`)) {
      return bin;
    }
  }
  return null;
}

/**
 * 判斷一個檔案要怎麼處理。
 *
 * png      未壓縮的 PNG，交給 pngquant
 * png-done 已經是 palette（pngquant 的產物），跳過
 * jpg      JPG/JPEG，交給 mozjpeg jpegtran。沒有「已處理」狀態可判斷，
 *          因為無損最佳化不留痕跡；靠無損本身 + 沒變小就保留來確保冪等
 * not-png  副檔名叫 .png 但內容不是 PNG，警告後略過
 */
function classify(file) {
  if (path.extname(file).toLowerCase() !== '.png') {
    return 'jpg';
  }
  const colorType = pngColorType(file);
  if (colorType === null) return 'not-png';
  return colorType === 3 ? 'png-done' : 'png';
}

const toKB = bytes => Math.round(bytes / 1024);

async function main() {
  const dryRun = process.argv.includes('--dry');

  // 第一個非 flag 參數當作子目錄，用來把範圍限縮到單篇文章
  const scope = process.argv.slice(2).find(arg => !arg.startsWith('--'));
  const pattern = scope ? `${scope}/**/*.{png,jpg,jpeg}` : '**/*.{png,jpg,jpeg}';

  const files = await glob(pattern, { cwd: POSTS_DIR, absolute: true });
  if (files.length === 0) {
    console.error(`[Compress] 在 source/_posts/${scope || ''} 找不到 PNG 或 JPG`);
    process.exit(1);
  }

  // --min-kb=N：只處理 N KB 以上的圖。小圖壓了也省不到多少，
  // 想先處理掉佔空間的大頭時用這個限縮範圍。
  const minKbArg = process.argv.find(arg => arg.startsWith('--min-kb='));
  const minBytes = minKbArg ? Number(minKbArg.split('=')[1]) * 1024 : 0;

  const kinds = files.map(file => ({ file, kind: classify(file) }));
  const targets = kinds
    .filter(item => item.kind === 'png' || item.kind === 'jpg')
    .filter(item => fs.statSync(item.file).size >= minBytes);
  const label = (scope ? `source/_posts/${scope}` : 'source/_posts')
    + (minBytes ? `（≥${minBytes / 1024}KB）` : '');

  kinds.filter(item => item.kind === 'not-png').forEach(({ file }) => {
    console.warn(`[Compress] 副檔名是 .png 但內容不是 PNG，已略過：${path.relative(POSTS_DIR, file)}`);
  });

  const pngWaiting = targets.filter(item => item.kind === 'png').length;
  const jpgWaiting = targets.filter(item => item.kind === 'jpg').length;
  const pngTotal = kinds.filter(item => item.kind === 'png' || item.kind === 'png-done').length;
  const jpgTotal = kinds.filter(item => item.kind === 'jpg').length;

  if (targets.length === 0) {
    console.log(`[Compress] ${label} 的 ${pngTotal} 張 PNG 全部壓縮過了，範圍內也沒有 JPG，沒有待處理的檔案`);
    return;
  }

  // 只在範圍內真的有對應檔案時才要求該工具，免得壓一篇純 PNG 的文章
  // 還被逼著裝 mozjpeg。
  if (!dryRun && pngWaiting > 0 && !hasPngquant()) {
    console.error('[Compress] 找不到 pngquant，請先安裝：brew install pngquant');
    process.exit(1);
  }

  const mozjpegTran = (!dryRun && jpgWaiting > 0) ? findMozjpegTran() : null;
  if (!dryRun && jpgWaiting > 0 && !mozjpegTran) {
    console.error('[Compress] 找不到 mozjpeg 版的 jpegtran，請先安裝：brew install mozjpeg');
    console.error('[Compress] PATH 上 libjpeg-turbo 的同名指令只能省一半，所以不拿來頂替。');
    console.error('[Compress] 裝在別的位置就用 MOZJPEG_JPEGTRAN=/路徑/jpegtran 指定。');
    process.exit(1);
  }

  const totalBefore = targets.reduce((sum, item) => sum + fs.statSync(item.file).size, 0);
  const summary = [
    pngTotal ? `${pngTotal} 張 PNG 中有 ${pngWaiting} 張未壓縮` : null,
    jpgTotal ? `${jpgWaiting} 張 JPG 重跑無損最佳化` : null,
  ].filter(Boolean).join('、');
  console.log(`[Compress] ${label}：${summary}，共 ${toKB(totalBefore)}KB`);

  if (dryRun) {
    targets
      .map(item => ({ ...item, size: fs.statSync(item.file).size }))
      .sort((left, right) => right.size - left.size)
      .forEach(({ file, kind, size }) => {
        const tag = kind === 'jpg' ? 'JPG 無損' : 'PNG 有損';
        console.log(`  ${String(toKB(size)).padStart(6)}KB  ${tag}  ${path.relative(POSTS_DIR, file)}`);
      });
    console.log('[Compress] --dry 模式，未修改任何檔案');
    return;
  }

  let done = 0;
  let skipped = 0;
  let totalAfter = 0;

  targets.forEach(({ file, kind }, index) => {
    // 先壓到暫存檔，確認成功而且真的變小才取代原圖。
    // pngquant 對顏色已經很少的圖可能壓不動（exit 99），那種情況保留原圖。
    // JPG 第二次跑起就會落到下面「沒變小」那條，這就是重跑不累積劣化的保險。
    const tmpFile = path.join(os.tmpdir(), `compress-${process.pid}-${index}${path.extname(file)}`);
    const before = fs.statSync(file).size;

    try {
      if (kind === 'png') {
        execFileSync('pngquant', [
          '--quality', QUALITY,
          '--speed', '1',
          '--force',
          '--output', tmpFile,
          file
        ], { stdio: 'ignore' });
      } else {
        // -optimize 重算 Huffman 表、-progressive 轉漸進式、-copy none 丟掉 EXIF。
        // 三個都只是換一種編法，解出來的像素跟原圖一模一樣。
        execFileSync(mozjpegTran, [
          '-optimize',
          '-progressive',
          '-copy', 'none',
          '-outfile', tmpFile,
          file
        ], { stdio: 'ignore' });
      }
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
