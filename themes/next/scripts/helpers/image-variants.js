/**
 * 縮圖的 <picture> 共用工具
 *
 * 首頁列表、articleCard、templateCard、n8n 資源頁的縮圖，原本都是直接
 * <img src="原圖">，送的是 2000px 寬的全尺寸圖，但顯示出來只有 120x120
 * （articleCard 是 120x80）。2026-09-01 實測首頁 20 張縮圖共 2505KB，
 * 改吃已經存在的 800w 變體只要 330KB。
 *
 * 這裡只做一件事：把既有的 <img> 原封不動包進 <picture>，前面加上
 * avif / webp 的 <source>。呼叫端的 img 屬性一個都不用改，對不到變體時
 * 直接回傳原本的 <img>，輸出跟以前一模一樣。
 *
 * 為什麼不用 srcset：縮圖是固定尺寸 + object-fit 裁切，沒有「螢幕不同要
 * 挑不同尺寸」的問題，給一個夠用的寬度就好。文章內文的圖不走這裡，
 * 那邊在 darrell-lightimage.js 有自己的 srcset 邏輯。
 *
 * 變體來源是 source/_data/image_variants.json（npm run images:webp 產生）。
 */

'use strict';

/** 縮圖要的寬度。顯示 120px，@2x 只要 240px，但 800w 是現成的就直接用。 */
const DEFAULT_WIDTH = 800;

/**
 * 這個模組匯出的是工廠，一定要傳 hexo 進來：
 *
 *   const { wrapWithSources } = require('../helpers/image-variants')(hexo);
 *
 * 不能在這裡直接用 hexo 這個名字。Hexo 是在載入 scripts/ 底下的檔案時才把
 * hexo 注入那個檔案的作用域，不是掛在 global 上，所以被 require 進來的模組
 * 取不到，執行時會炸 ReferenceError: hexo is not defined。
 */
module.exports = function createImageVariants(hexo) {

/**
 * 從圖片網址找出 manifest 條目，找不到回傳 null。
 *
 * 網址可能是完整的（https://www.darrelltw.com/slug/x.jpg）或站內絕對路徑
 * （/slug/x.jpg），兩種都先化簡成 /_posts/slug/x.jpg 這個 key。
 * /gallery/、/images/ 這種不在 _posts 底下的縮圖對不到，回 null 就好。
 */
function lookupEntry(imageUrl) {
  if (!imageUrl || typeof imageUrl !== 'string') return null;

  const data = hexo.locals.get('data');
  const variants = data && data.image_variants;
  if (!variants) return null;

  const urlPath = imageUrl.replace(/^https?:\/\/[^/]+/, '');
  const key = '/_posts' + urlPath;
  if (variants[key]) return variants[key];

  // 路徑對不到就退回檔名比對。全站有幾個同名檔案分在不同文章裡，
  // 有兩個以上候選時寧可不輸出，也不要賭一個而抓到別篇的圖。
  const name = urlPath.split('/').pop();
  const matches = Object.keys(variants).filter(k => k.endsWith('/' + name));
  return matches.length === 1 ? variants[matches[0]] : null;
}

/** 從變體清單裡挑第一個寬度夠的，都不夠就用最大的那個 */
function pickVariant(list, targetWidth) {
  if (!list || list.length === 0) return null;
  const sorted = list.slice().sort((a, b) => a.width - b.width);
  return sorted.find(v => v.width >= targetWidth) || sorted[sorted.length - 1];
}

/**
 * 把 imgHtml 包成 <picture>，前面加 avif / webp 的 <source>。
 *
 * 順序就是優先序：瀏覽器由上而下取第一個看得懂的 type，兩種都不支援的
 * 才會用到 <img> 裡的原圖。對不到變體時原樣回傳 imgHtml。
 */
function wrapWithSources(imageUrl, imgHtml, targetWidth) {
  const entry = lookupEntry(imageUrl);
  if (!entry) return imgHtml;

  const width = targetWidth || DEFAULT_WIDTH;
  const baseUrl = imageUrl.substring(0, imageUrl.lastIndexOf('/') + 1);

  const toSource = (list, type) => {
    const v = pickVariant(list, width);
    return v ? `<source type="${type}" srcset="${baseUrl}${v.src}">` : '';
  };

  const sources = toSource(entry.avif, 'image/avif') + toSource(entry.webp, 'image/webp');
  return sources ? `<picture>${sources}${imgHtml}</picture>` : imgHtml;
}

/**
 * 給 swig 模板用：直接產出完整的 <picture>（或退回單一 <img>）。
 * attrs 是要原樣放進 <img> 的屬性字串。
 */
function thumbnailPicture(imageUrl, alt, attrs) {
  const safeAlt = String(alt == null ? '' : alt).replace(/"/g, '&quot;');
  const imgHtml = `<img src="${imageUrl}" alt="${safeAlt}"${attrs ? ' ' + attrs : ''}>`;
  return wrapWithSources(imageUrl, imgHtml);
}

  return { lookupEntry, pickVariant, wrapWithSources, thumbnailPicture };
};
