/* global hexo */

'use strict';

function customLightGallery(args, content) {
  let altText = args[0];
  let imageSrc = args[1];
  let className = args[2];

  if(!className || className == ""){
    className = "max-1024";
  }

  if(!altText || !imageSrc){
    return ``
  }
  // <img
	// alt="Jellyfish"
	// sizes="(min-width: 1000px) 930px, 90vw"
	// data-srcset="small.jpg 500w,
	// 	medium.jpg 640w,
	// 	big.jpg 1024w"
	// data-src="medium.jpg"
	// class="lazyload" />
  
  return `
  <figure lg-background-color="#282828" class="blog-images" data-src="${imageSrc}">
    <img alt="${altText}" data-src="${imageSrc}" class="lazyload ${className}" sizes="(min-width: 1000px) 930px, 90vw">
  </figure>`
}

function customLightGallery800(args, content) {
  let altText = args[0];
  let imageSrc = args[1];
  let className = args[2];

  if(!className || className == ""){
    className = "max-800";
  }

  if(!altText || !imageSrc){
    return ``
  }
  // <img
	// alt="Jellyfish"
	// sizes="(min-width: 1000px) 930px, 90vw"
	// data-srcset="small.jpg 500w,
	// 	medium.jpg 640w,
	// 	big.jpg 1024w"
	// data-src="medium.jpg"
	// class="lazyload" />
  
  return `
  <figure lg-background-color="#282828" class="blog-images" data-src="${imageSrc}">
    <img alt="${altText}" data-src="${imageSrc}" class="lazyload ${className}" sizes="(min-width: 800px) 930px, 90vw">
  </figure>`
}

function customLightGalleryCover(args) {
  let altText = args[0];
  let imageSrc = args[1];
  let className = args[2];

  if(!className || className == ""){
    className = "max-1024";
  }

  if(!altText || !imageSrc){
    return ``
  }
  
  return `
  <figure lg-background-color="#282828" class="blog-images" data-src="${imageSrc}" style="min-height: 200px;">
    <img alt="${altText}" data-src="${imageSrc}" src="${imageSrc}" class="lazyload ${className}" sizes="(min-width: 1000px) 930px, 90vw" style="object-fit: contain;">
  </figure>`
}

hexo.extend.tag.register('darrellImage', customLightGallery, {ends: false});
hexo.extend.tag.register('darrellImage800', customLightGallery800, {ends: false});
hexo.extend.tag.register('darrellImageCover', customLightGalleryCover, {ends: false});
