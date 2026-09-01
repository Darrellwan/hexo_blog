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
 *   npm run images:webp -- --force           忽略快取，全部重新編碼
 *   npm run images:webp -- --avif            順便產 avif 變體（需要 avifenc）
 *
 * --avif：除了 webp 再產一組同尺寸的 avif，寫進 manifest 的 avif 欄位，
 * 圖片標籤會把 <source type="image/avif"> 排在 webp 前面。2026-09-01 用本站
 * 10 張代表圖實測（800w、對照現有 webp q82）：體積 523KB→370KB（少 29%），
 * 平均 SSIM 0.9749→0.9870（畫質反而更好）。不帶這個 flag 的行為完全不變。
 *
 * 🔴 帶 --avif 時，沒有 avif 紀錄的圖會連 webp 一起重壓一次（快取整筆算沒命中）。
 * 正確但慢，全站第一次鋪開要等；之後就會被快取跳過。
 *
 * 增量跳過：manifest 記了每張原圖處理當下的 mtime，原圖沒變、上次的產出
 * （或「webp 比原圖大所以放棄」的紀錄，存成 webp: []）還在就直接跳過。
 * 所以重跑只會重壓有變動的圖；改了 cwebp 參數想全站重壓時用 --force。
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
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { glob } = require('glob');
const { imageSize } = require('image-size');

// avif 縮圖用的 ImageMagick 路徑。在 main() 裡才偵測——這個檔案會被 Hexo
// 當 plugin 載入，module 層級去戳外部執行檔會拖慢每次 hexo 啟動。
let MAGICK = null;

const POSTS_DIR = path.join(__dirname, '../source/_posts');
const MANIFEST = path.join(__dirname, '../source/_data/image_variants.json');
const QUALITY = '82';
// avifenc 的品質尺度跟 cwebp 不一樣，數字不能互相對照。60 是實測挑出來的：
// 同尺寸下比 webp q82 小 29%，SSIM 還高一截（0.9870 vs 0.9749）。
const AVIF_QUALITY = '60';
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

function hasAvifenc() {
  try {
    execFileSync('avifenc', ['--version'], { stdio: 'ignore' });
    return true;
  } catch (err) {
    return false;
  }
}

/** ImageMagick 的位置，avif 縮圖要用。找不到回傳 null。 */
function findMagick() {
  for (const bin of ['/opt/homebrew/bin/magick', '/usr/local/bin/magick', 'magick']) {
    try {
      execFileSync(bin, ['-version'], { stdio: 'ignore' });
      return bin;
    } catch (err) {
      // 換下一個候選
    }
  }
  return null;
}

const WEBP_FORMAT = {
  ext: 'webp',
  // cwebp 自己會縮圖，一步到位
  encode: (src, out, w) => execFileSync('cwebp',
    ['-quiet', '-q', QUALITY, '-m', '6', '-resize', String(w), '0', src, '-o', out],
    { stdio: 'ignore' }),
};

/**
 * avifenc 沒有縮圖功能，所以先用 ImageMagick 縮到暫存 PNG 再編碼。
 *
 * 為什麼不用 macOS 內建的 sips（免一個依賴）：`sips -Z` 限制的是「最長邊」
 * 不是寬度，800x1656 的直式圖會被縮成 386x800；而且它讀不了本站那個
 * 副檔名叫 .png、內容其實是 WebP 的檔案。
 *
 * -j all 吃滿 CPU 核心；--speed 6 是編碼速度與體積的折衷，本機批次跑得完。
 */
const AVIF_FORMAT = {
  ext: 'avif',
  encode: (src, out, w) => {
    const tmp = path.join(os.tmpdir(), `avif-src-${process.pid}-${w}.png`);
    try {
      execFileSync(MAGICK, [src, '-resize', `${w}x>`, tmp], { stdio: 'ignore' });
      execFileSync('avifenc', ['-q', AVIF_QUALITY, '--speed', '6', '-j', 'all', tmp, out],
        { stdio: 'ignore' });
    } finally {
      try { fs.unlinkSync(tmp); } catch (e) {}
    }
  },
};

/**
 * 產一組指定格式的變體，回傳「比原圖小」的那幾個。
 *
 * 比原圖大的直接刪掉不留：<picture> 只有在變體更小的時候才有意義，
 * 留著只會佔 repo 空間又永遠不會被送出去。
 */
function encodeVariants(file, dir, base, widths, origSize, format) {
  const produced = [];

  for (const w of widths) {
    const out = path.join(dir, `${base}-${w}.${format.ext}`);
    try {
      format.encode(file, out, w);
      produced.push({ width: w, file: out, size: fs.statSync(out).size });
    } catch (err) {
      console.warn(`[Webp] ${format.ext} 轉檔失敗：${path.relative(POSTS_DIR, file)} @${w}w`);
    }
  }

  const valid = produced.filter(p => p.size < origSize);
  produced.filter(p => p.size >= origSize).forEach(p => {
    try { fs.unlinkSync(p.file); } catch (e) {}
  });
  return valid;
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
  const force = args.includes('--force');
  const subDir = args.find(a => !a.startsWith('--'));

  const wantAvif = args.includes('--avif');

  if (!dryRun && !hasCwebp()) {
    console.error('[Webp] 找不到 cwebp，請先安裝：brew install webp');
    process.exit(1);
  }

  if (!dryRun && wantAvif) {
    if (!hasAvifenc()) {
      console.error('[Webp] --avif 需要 avifenc，請先安裝：brew install libavif');
      process.exit(1);
    }
    MAGICK = findMagick();
    if (!MAGICK) {
      console.error('[Webp] --avif 需要 ImageMagick 來縮圖（avifenc 自己不會縮），請先安裝：brew install imagemagick');
      process.exit(1);
    }
  }

  const scope = subDir ? path.join(POSTS_DIR, subDir) : POSTS_DIR;
  if (!fs.existsSync(scope)) {
    console.error(`[Webp] 找不到目錄：${scope}`);
    process.exit(1);
  }

  const pattern = path.join(scope, '**/*.{png,jpg,jpeg,PNG,JPG,JPEG,webp}').split(path.sep).join('/');
  const allFiles = (await glob(pattern)).sort();
  const files = allFiles.filter(f => !/-\d+\.webp$/i.test(f));

  const manifest = fs.existsSync(MANIFEST)
    ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8'))
    : {};

  let done = 0;
  let skipped = 0;
  let cached = 0;
  let origTotal = 0;
  let webpTotal = 0;
  let avifTotal = 0;
  let webpCmpTotal = 0;   // 跟 avifTotal 對應的同尺寸 webp 合計，只用來算 avif 省了多少

  for (const file of files) {
    const dir = path.dirname(file);
    const ext = path.extname(file);
    const base = path.basename(file, ext);
    const stat = fs.statSync(file);

    // 增量跳過：原圖 mtime 跟上次處理時一樣、產出的變體檔都還在就不重壓。
    // webp: [] 是負向快取（上次判定 webp 比原圖大而放棄），一樣不重試。
    // 舊格式的條目沒有 srcMtimeMs，比不中，會重壓一次然後補上。
    const prev = manifest[manifestKey(file)];
    if (!force && !dryRun && prev && prev.srcMtimeMs === stat.mtimeMs) {
      const intact = list => (list || []).every(v => fs.existsSync(path.join(dir, v.src)));
      // avif 是後來才加的欄位：舊條目連 key 都沒有，這時候不能算命中，
      // 否則所有 mtime 沒變的圖永遠不會被補產 avif。
      const avifReady = !wantAvif || (prev.avif !== undefined && intact(prev.avif));
      if (intact(prev.webp) && avifReady) {
        cached++;
        continue;
      }
    }

    let naturalWidth;
    try {
      naturalWidth = imageSize(fs.readFileSync(file)).width;
    } catch (err) {
      console.warn(`[Webp] 讀不到尺寸，跳過：${path.relative(POSTS_DIR, file)}`);
      continue;
    }

    const widths = targetWidths(naturalWidth);
    const origSize = stat.size;

    if (dryRun) {
      console.log(`  ${path.relative(POSTS_DIR, file)}  ${naturalWidth}px -> ${widths.join('w, ')}w`);
      continue;
    }

    const validVariants = encodeVariants(file, dir, base, widths, origSize, WEBP_FORMAT);
    let avifVariants = wantAvif
      ? encodeVariants(file, dir, base, widths, origSize, AVIF_FORMAT)
      : null;

    // avif 排在 webp 前面，支援的瀏覽器一定拿 avif，所以同一個尺寸的 avif
    // 沒有比 webp 小就是幫倒忙——大片純色的 UI 截圖很常這樣。這種就刪掉，
    // 讓那個尺寸退回 webp。
    // 同尺寸沒有 webp 可比的（webp 比原圖大被放棄）則保留：那是純賺的。
    if (avifVariants) {
      const webpSizeAt = new Map(validVariants.map(v => [v.width, v.size]));
      avifVariants = avifVariants.filter(a => {
        const webpSize = webpSizeAt.get(a.width);
        if (webpSize !== undefined && a.size >= webpSize) {
          try { fs.unlinkSync(a.file); } catch (e) {}
          return false;
        }
        return true;
      });
    }

    const toEntry = list => list.map(p => ({ width: p.width, src: path.basename(p.file) }));
    const entry = { webp: toEntry(validVariants), srcMtimeMs: stat.mtimeMs };
    if (avifVariants) {
      entry.avif = toEntry(avifVariants);
    } else if (prev && prev.avif !== undefined) {
      // 這一輪沒產 avif 就沿用上次的紀錄，別把既有的 avif 欄位洗掉
      entry.avif = prev.avif;
    }
    manifest[manifestKey(file)] = entry;

    if (entry.webp.length === 0 && (entry.avif || []).length === 0) {
      // 圖片標籤那邊對空陣列直接不輸出 <source>，跟沒有條目時行為相同
      skipped++;
      console.log(`  跳過  ${path.relative(POSTS_DIR, file)}  變體都沒有比原圖 ${toKB(origSize)}KB 小`);
      continue;
    }

    origTotal += origSize;
    if (validVariants.length) webpTotal += validVariants[validVariants.length - 1].size;
    // avif 只跟「同尺寸也有 webp」的部分比。兩邊保留的尺寸可能不一樣
    // （webp 放棄了某個尺寸、avif 留著），直接比各自的最大變體會得到假數字。
    if (avifVariants) {
      const webpSizeAt = new Map(validVariants.map(v => [v.width, v.size]));
      for (const a of avifVariants) {
        const webpSize = webpSizeAt.get(a.width);
        if (webpSize !== undefined) {
          avifTotal += a.size;
          webpCmpTotal += webpSize;
        }
      }
    }
    done++;
    const fmtList = list => list.map(p => `${p.width}w ${toKB(p.size)}KB`).join(', ');
    console.log(
      `  ${path.relative(POSTS_DIR, file)}  原圖 ${toKB(origSize)}KB -> ` +
      `webp ${fmtList(validVariants)}` +
      (avifVariants && avifVariants.length ? `｜avif ${fmtList(avifVariants)}` : '')
    );
  }

  if (dryRun) {
    console.log(`[Webp] dry run：${files.length} 張圖在範圍內`);
    return;
  }

  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
  const saved = origTotal - webpTotal;
  console.log(
    `[Webp] 產出 ${done} 張、放棄 ${skipped} 張、快取跳過 ${cached} 張。` +
    `以最大變體比較：${toKB(origTotal)}KB -> ${toKB(webpTotal)}KB` +
    (origTotal ? `，省下 ${toKB(saved)}KB（${Math.round((saved / origTotal) * 100)}%）` : '')
  );
  if (wantAvif && webpCmpTotal) {
    // 支援 avif 的瀏覽器本來就會拿 webp，省的是這個差額
    const vsWebp = webpCmpTotal - avifTotal;
    console.log(
      `[Webp] avif ${toKB(avifTotal)}KB vs 同尺寸 webp ${toKB(webpCmpTotal)}KB，` +
      `少 ${toKB(vsWebp)}KB（${Math.round((vsWebp / webpCmpTotal) * 100)}%）`
    );
  }
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
