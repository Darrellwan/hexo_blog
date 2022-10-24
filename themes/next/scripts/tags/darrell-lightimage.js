/* global hexo */

'use strict';

function customLightGallery(args, content) {
  let altText = args[0];
  let imageSrc = args[1];

  if(!altText || !imageSrc){
    return ``
  }
  
  return `
  <figure lg-background-color="#282828" class="blog-images" data-src="${imageSrc}">
    <img alt="${altText}" src="${imageSrc}">
  </figure>`
}

hexo.extend.tag.register('darrellImage', customLightGallery, {ends: false});
