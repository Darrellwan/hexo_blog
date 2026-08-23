/**
 * 文章圖片的 webp 變體
 *
 * 用 cwebp 把 source/_posts/ 底下的 PNG/JPG 轉出 800w 與 1600w 兩個 webp，
 * 檔名是 <原檔名>-<寬度>.webp，跟原圖放在同一個資料夾。
 * 產生的清單寫進 source/_data/image_variants.json，圖片標籤據此輸出 <picture>。
 *
 * 用法：
 *   npm run images:webp                      處理 source/_posts/ 全部
 *   npm run images:webp -- grok-bot-review   只處理某篇文章
 *   npm run images:webp -- --dry             只列出會做什麼，不寫檔
 *
 * 為什麼要有這支：文章圖普遍是 2060px 寬，實測桌機只顯示 707px、手機 350px，
 * 等於每張都送了三倍的多餘像素。省最多的是縮尺寸，換格式是其次。
 *
 * 🔴 webp 不是一定比較小。現況的 PNG 是 pngquant 壓過的 256 色 palette，
 * 對純色 UI 截圖效率極高，無損 webp 實測反而大 65%。所以這支的規則是
 * 「產完比大小，最大的那個變體沒有比原圖小就整張放棄」，讓瀏覽器退回原圖，
 * 不會出現愈優化愈肥的情況。
 *
 * 為什麼在本機跑而不是放進 build：cwebp 是本機裝的執行檔，Vercel 建置環境沒有；
 * 改走 build 就得加 sharp 這個原生依賴，而且每次部署都是 fresh clone，
 * 1291 張要重新編碼。這個 repo 的 images:compress 本來就是本機預處理再 commit，
 * 照同一個模式走。
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { glob } = require('glob');
const { imageSize } = require('image-size');

const POSTS_DIR = path.join(__dirname, '../source/_posts');
const MANIFEST = path.join(__dirname, '../source/_data/image_variants.json');
const QUALITY = '82';
const TARGET_WIDTHS = [800, 1600];

const toKB = bytes => Math.round(bytes / 1024);

function hasCwebp() {
  try {
    execFileSync('cwebp', ['-version'], { stdio: 'ignore' });
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * 算出這張圖要產哪幾個寬度。
 *
 * 原圖比目標窄的時候不放大，直接用原圖寬度，所以 624px 的圖只會產一個 624w，
 * 不會產出兩個內容一樣的檔案。
 */
function targetWidths(naturalWidth) {
  const widths = TARGET_WIDTHS.map(w => Math.min(w, naturalWidth));
  return [...new Set(widths)].sort((a, b) => a - b);
}

/** manifest 的 key 沿用 image_dimensions.json 的格式，去掉 source 前綴 */
function manifestKey(filePath) {
  return '/' + path.relative(path.join(__dirname, '../source'), filePath).split(path.sep).join('/');
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry');
  const subDir = args.find(a => !a.startsWith('--'));

  if (!dryRun && !hasCwebp()) {
    console.error('[Webp] 找不到 cwebp，請先安裝：brew install webp');
    process.exit(1);
  }

  const scope = subDir ? path.join(POSTS_DIR, subDir) : POSTS_DIR;
  if (!fs.existsSync(scope)) {
    console.error(`[Webp] 找不到目錄：${scope}`);
    process.exit(1);
  }

  const pattern = path.join(scope, '**/*.{png,jpg,jpeg,PNG,JPG,JPEG}').split(path.sep).join('/');
  const files = (await glob(pattern)).sort();

  const manifest = fs.existsSync(MANIFEST)
    ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8'))
    : {};

  let done = 0;
  let skipped = 0;
  let origTotal = 0;
  let webpTotal = 0;

  for (const file of files) {
    const dir = path.dirname(file);
    const ext = path.extname(file);
    const base = path.basename(file, ext);

    let naturalWidth;
    try {
      naturalWidth = imageSize(fs.readFileSync(file)).width;
    } catch (err) {
      console.warn(`[Webp] 讀不到尺寸，跳過：${path.relative(POSTS_DIR, file)}`);
      continue;
    }

    const widths = targetWidths(naturalWidth);
    const origSize = fs.statSync(file).size;

    if (dryRun) {
      console.log(`  ${path.relative(POSTS_DIR, file)}  ${naturalWidth}px -> ${widths.join('w, ')}w`);
      continue;
    }

    const produced = [];
    for (const w of widths) {
      const out = path.join(dir, `${base}-${w}.webp`);
      try {
        execFileSync('cwebp', ['-quiet', '-q', QUALITY, '-resize', String(w), '0', file, '-o', out]);
        produced.push({ width: w, file: out, size: fs.statSync(out).size });
      } catch (err) {
        console.warn(`[Webp] 轉檔失敗：${path.relative(POSTS_DIR, file)} @${w}w`);
      }
    }

    if (produced.length === 0) continue;

    // 最大的變體沒有比原圖小，代表這張圖 webp 打不過 palette PNG，整張放棄。
    // 只留小尺寸變體會害瀏覽器在高解析度螢幕上把 800w 放大成 1600px，那更糟。
    const largest = produced[produced.length - 1];
    if (largest.size >= origSize) {
      produced.forEach(p => fs.unlinkSync(p.file));
      delete manifest[manifestKey(file)];
      skipped++;
      console.log(`  跳過  ${path.relative(POSTS_DIR, file)}  webp ${toKB(largest.size)}KB >= 原圖 ${toKB(origSize)}KB`);
      continue;
    }

    manifest[manifestKey(file)] = {
      webp: produced.map(p => ({ width: p.width, src: path.basename(p.file) })),
    };
    origTotal += origSize;
    webpTotal += largest.size;
    done++;
    console.log(
      `  ${path.relative(POSTS_DIR, file)}  原圖 ${toKB(origSize)}KB -> ` +
      produced.map(p => `${p.width}w ${toKB(p.size)}KB`).join(', ')
    );
  }

  if (dryRun) {
    console.log(`[Webp] dry run：${files.length} 張圖在範圍內`);
    return;
  }

  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
  const saved = origTotal - webpTotal;
  console.log(
    `[Webp] 產出 ${done} 張、放棄 ${skipped} 張。` +
    `以最大變體比較：${toKB(origTotal)}KB -> ${toKB(webpTotal)}KB` +
    (origTotal ? `，省下 ${toKB(saved)}KB（${Math.round((saved / origTotal) * 100)}%）` : '')
  );
  console.log(`[Webp] 清單已寫入 ${path.relative(path.join(__dirname, '..'), MANIFEST)}`);
}

// scripts/ 底下的檔案會被 Hexo 當 plugin 載入，所以只有直接執行時才跑，
// 否則 hexo server 啟動時會把 argv 裡的 server 當成子目錄名然後整個掛掉。
if (require.main === module) {
  main().catch(err => {
    console.error('[Webp] 執行失敗:', err);
    process.exit(1);
  });
}

module.exports = main;
