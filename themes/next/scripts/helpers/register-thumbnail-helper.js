/**
 * 把 thumbnail_picture 註冊成 Hexo helper，給 .swig 模板用（首頁列表縮圖）。
 *
 * 這件事必須放在會被 Hexo 當 script 載入的檔案裡：只有這種檔案的作用域才有
 * hexo，image-variants.js 被 require 進來時是拿不到的，所以那邊做成工廠。
 */

'use strict';

const createImageVariants = require('./image-variants');

const { thumbnailPicture } = createImageVariants(hexo);

hexo.extend.helper.register('thumbnail_picture', thumbnailPicture);
