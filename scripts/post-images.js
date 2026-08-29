/**
 * 文章圖片一鍵入口：按正確順序跑完三支圖片腳本。
 *
 * 用法：
 *   npm run images:post -- <文章slug>   處理單篇（日常用這個）
 *   npm run images:post                 全站（三支各自有增量快取，重跑很快）
 *
 * 順序有硬性理由，不能換：
 *   1. compress-images   pngquant 原地壓 PNG，會改檔案內容與 mtime
 *   2. generate-webp     從「壓縮後」的原圖產變體；先跑的話 mtime 快取會被
 *                        步驟 1 弄失效，下次又全部重壓一輪
 *   3. image-dimensions  量的是原圖尺寸，pngquant/webp 都不改尺寸，放最後
 *                        只是順便補新圖的條目
 *
 * flag 只轉傳給前兩支（--dry / --force / --min-kb=N），
 * generate-image-dimensions 的 --force 語意不同，不轉傳。
 */

const path = require('path');
const { execFileSync } = require('child_process');

function main() {
  const args = process.argv.slice(2);

  const steps = [
    { name: 'compress-images.js', args },
    { name: 'generate-webp.js', args },
    { name: 'generate-image-dimensions.js', args: [] },
  ];

  for (const step of steps) {
    console.log(`\n[images:post] ▶ ${step.name} ${step.args.join(' ')}`);
    execFileSync(process.execPath, [path.join(__dirname, step.name), ...step.args], {
      stdio: 'inherit',
    });
  }
}

// scripts/ 底下的檔案會被 Hexo 當 plugin 載入，只有直接執行時才跑
if (require.main === module) {
  main();
}
