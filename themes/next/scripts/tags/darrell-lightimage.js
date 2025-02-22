/* global hexo */

'use strict';

// 生成 SVG 佔位符
function generatePlaceholder(width, height) {
  const ratio = (height / width * 100).toFixed(2);
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'%3E%3Crect width='100%25' height='100%25' fill='%23282828'/%3E%3Cpath d='M${width/3} ${height/3} L${width/2} ${height/2} L${width*2/3} ${height/3} M${width/2} ${height/2} L${width/2} ${height*2/3}' stroke='%23666' stroke-width='2'/%3E%3C/svg%3E`;
}

function customLightGallery(args, content) {
  let altText = args[0];
  let imageSrc = args[1];
  let className = args[2];
  // 預設尺寸 1024x576（16:9）
  let width = 1024;
  let height = 576;

  if(!className || className == ""){
    className = "max-1024";
  }

  if(!altText || !imageSrc){
    return ``
  }
  return `
  <figure lg-background-color="#282828" class="blog-images" data-src="${imageSrc}" style="aspect-ratio: ${width}/${height};">
    <img 
      alt="${altText}" 
      data-src="${imageSrc}" 
      src="${generatePlaceholder(width, height)}"
      class="lazyload ${className}" 
      sizes="(min-width: 1000px) 930px, 90vw"
      style="background-color: #f0f0f0;">
  </figure>`
}

function customLightGallery800(args, content) {
  let altText = args[0];
  let imageSrc = args[1];
  let className = args[2];
  // 預設尺寸 800x450（16:9）
  let width = 800;
  let height = 200;

  if(!className || className == ""){
    className = "max-800";
  }

  if(!altText || !imageSrc){
    return ``
  }
  
  return `
  <figure lg-background-color="#282828" class="blog-images" data-src="${imageSrc}" style="aspect-ratio: ${width}/${height};">
    <img 
      alt="${altText}" 
      data-src="${imageSrc}"
      src="${generatePlaceholder(width, height)}"
      class="lazyload ${className}" 
      sizes="(min-width: 800px) 930px, 90vw"
      style="background-color: #f0f0f0;">
  </figure>`
}

function customLightGallery800h(args, content) {
  let altText = args[0];
  let imageSrc = args[1];
  let className = args[2];
  // 預設尺寸 800x800（1:1）
  let width = 800;
  let height = 800;

  if(!className || className == ""){
    className = "max-800h";
  }

  if(!altText || !imageSrc){
    return ``
  }
  
  return `
  <figure lg-background-color="#282828" class="blog-images" data-src="${imageSrc}" style="aspect-ratio: ${width}/${height};">
    <img 
      alt="${altText}" 
      data-src="${imageSrc}"
      src="${generatePlaceholder(width, height)}"
      class="lazyload ${className}" 
      sizes="(max-width: 100%) 930px, 90vw"
      style="background-color: #f0f0f0;">
  </figure>`
}

function customLightGalleryCover(args) {
  let altText = args[0];
  let imageSrc = args[1];
  let className = args[2];
  let width = 800;
  let height = 600;

  if(!className || className == ""){
    className = "max-1024";
  }

  if(!altText || !imageSrc){
    return ``
  }
  
  return `
  <figure lg-background-color="#282828" class="blog-images" data-src="${imageSrc}" style="aspect-ratio: ${width}/${height};">
    <img 
      alt="${altText}" 
      data-src="${imageSrc}" 
      src="${imageSrc}"
      class="${className}" 
      sizes="(min-width: 1000px) 930px, 90vw" 
      width="800"
      height="450"
      style="background-color: #f0f0f0;">
  </figure>`
}

function customOnlyImage(args) {
  let altText = args[0];
  let imageSrc = args[1];
  let className = args[2];
  // 預設尺寸 1024x576（16:9）
  let width = 1024;
  let height = 576;

  if(!className || className == ""){
    className = "max-1024";
  }

  if(!altText || !imageSrc){
    return ``
  }
  
  return `
  <img 
    alt="${altText}" 
    data-src="${imageSrc}" 
    src="${generatePlaceholder(width, height)}"
    class="${className}"
    style="aspect-ratio: ${width}/${height}; background-color: #f0f0f0;">`
}

hexo.extend.tag.register('darrellImage', customLightGallery, {ends: false});
hexo.extend.tag.register('darrellOnlyImage', customOnlyImage, {ends: false});
hexo.extend.tag.register('darrellImage800', customLightGallery800, {ends: false});
hexo.extend.tag.register('darrellImageh800', customLightGallery800h, {ends: false});
hexo.extend.tag.register('darrellImageCover', customLightGalleryCover, {ends: false});
