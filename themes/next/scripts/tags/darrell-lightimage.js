/* global hexo */

'use strict';

// 生成 SVG 佔位符
function generatePlaceholder(width, height) {
  const ratio = (height / width * 100).toFixed(2);
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'%3E%3Crect width='100%25' height='100%25' fill='%23282828'/%3E%3Cpath d='M${width/3} ${height/3} L${width/2} ${height/2} L${width*2/3} ${height/3} M${width/2} ${height/2} L${width/2} ${height*2/3}' stroke='%23666' stroke-width='2'/%3E%3C/svg%3E`;
}

function generateVideoPlaceholder(width, height) {
  // 保持 16:9 的比例
  height = height || Math.round(width * 9 / 16);
  
  // 行星可能的顏色集合
  const planetColors = [
    '%233498DB', // 藍色
    '%23E59866', // 橙色
    '%23C0392B', // 紅色
    '%238E44AD', // 紫色
    '%232ECC71', // 綠色
    '%23F1C40F', // 黃色
    '%2395A5A6'  // 灰色
  ];
  
  // 為每個行星隨機生成特性
  const planets = [];
  for (let i = 0; i < 3; i++) {
    planets.push({
      // 隨機大小 (5-12)
      size: Math.floor(Math.random() * 8) + 5,
      // 隨機顏色
      color: planetColors[Math.floor(Math.random() * planetColors.length)],
      // 隨機軌道半徑 (140-220)
      orbitRadius: Math.floor(Math.random() * 80) + 140,
      // 隨機起始角度 (0-359)
      startAngle: Math.floor(Math.random() * 360),
      // 隨機速度 (15-32秒)
      duration: Math.floor(Math.random() * 18) + 15
    });
  }
  
  // 使用 URL 安全的 SVG 編碼
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 800 450'%3E
    %3C!-- 背景 --%3E
    %3Crect width='800' height='450' fill='%230A0E17'/%3E
    
    %3C!-- 星星 --%3E
    %3Cg id='stars'%3E
      %3Ccircle cx='100' cy='80' r='1' fill='white' opacity='0.8'/%3E
      %3Ccircle cx='200' cy='50' r='1.2' fill='white' opacity='0.7'/%3E
      %3Ccircle cx='300' cy='90' r='0.8' fill='white' opacity='0.9'/%3E
      %3Ccircle cx='400' cy='40' r='1' fill='white' opacity='0.8'/%3E
      %3Ccircle cx='500' cy='70' r='1.2' fill='white' opacity='0.7'/%3E
      %3Ccircle cx='600' cy='60' r='0.8' fill='white' opacity='0.9'/%3E
      %3Ccircle cx='700' cy='100' r='1' fill='white' opacity='0.8'/%3E
      %3Ccircle cx='150' cy='150' r='1.2' fill='white' opacity='0.7'/%3E
      %3Ccircle cx='250' cy='200' r='0.8' fill='white' opacity='0.9'/%3E
      %3Ccircle cx='350' cy='350' r='1' fill='white' opacity='0.8'/%3E
      %3Ccircle cx='450' cy='250' r='1.2' fill='white' opacity='0.7'/%3E
      %3Ccircle cx='550' cy='300' r='0.8' fill='white' opacity='0.9'/%3E
      %3Ccircle cx='650' cy='350' r='1' fill='white' opacity='0.8'/%3E
      %3Ccircle cx='750' cy='400' r='1.2' fill='white' opacity='0.7'/%3E
    %3C/g%3E
    
    %3C!-- 行星軌道 --%3E
    %3Ccircle cx='400' cy='225' r='${planets[0].orbitRadius}' fill='none' stroke='%23333' stroke-width='0.8' opacity='0.3'/%3E
    %3Ccircle cx='400' cy='225' r='${planets[1].orbitRadius}' fill='none' stroke='%23333' stroke-width='0.8' opacity='0.3'/%3E
    %3Ccircle cx='400' cy='225' r='${planets[2].orbitRadius}' fill='none' stroke='%23333' stroke-width='0.8' opacity='0.3'/%3E
    
    %3C!-- 行星1 --%3E
    %3Cg%3E
      %3CanimateTransform attributeName='transform' type='rotate' from='${planets[0].startAngle} 400 225' to='${planets[0].startAngle + 360} 400 225' dur='${planets[0].duration}s' repeatCount='indefinite' additive='sum'/%3E
      %3Ccircle cx='${400 + planets[0].orbitRadius}' cy='225' r='${planets[0].size}' fill='${planets[0].color}'%3E
        %3Canimate attributeName='r' values='${planets[0].size};${planets[0].size * 1.05};${planets[0].size}' dur='5s' repeatCount='indefinite'/%3E
      %3C/circle%3E
    %3C/g%3E
    
    %3C!-- 行星2 --%3E
    %3Cg%3E
      %3CanimateTransform attributeName='transform' type='rotate' from='${planets[1].startAngle} 400 225' to='${planets[1].startAngle + 360} 400 225' dur='${planets[1].duration}s' repeatCount='indefinite' additive='sum'/%3E
      %3Ccircle cx='${400 + planets[1].orbitRadius}' cy='225' r='${planets[1].size}' fill='${planets[1].color}'%3E
        %3Canimate attributeName='r' values='${planets[1].size};${planets[1].size * 1.05};${planets[1].size}' dur='4s' repeatCount='indefinite'/%3E
      %3C/circle%3E
    %3C/g%3E
    
    %3C!-- 行星3 --%3E
    %3Cg%3E
      %3CanimateTransform attributeName='transform' type='rotate' from='${planets[2].startAngle} 400 225' to='${planets[2].startAngle + 360} 400 225' dur='${planets[2].duration}s' repeatCount='indefinite' additive='sum'/%3E
      %3Ccircle cx='${400 + planets[2].orbitRadius}' cy='225' r='${planets[2].size}' fill='${planets[2].color}'%3E
        %3Canimate attributeName='r' values='${planets[2].size};${planets[2].size * 1.05};${planets[2].size}' dur='3s' repeatCount='indefinite'/%3E
      %3C/circle%3E
    %3C/g%3E
  %3C/svg%3E`;
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

function customVideoSimple(args) {
  let altText = args[0];
  let videoSrc = args[1];
  let className = args[2] || "max-800";
  let uniqueId = 'video-' + Math.random().toString(36).substr(2, 9);
  
  if(!altText || !videoSrc){
    return ``
  }
  
  // 直接使用預設 SVG
  let posterSrc = generateVideoPlaceholder(800, 450);
  
  // 新增: 保證影片容器有高度
  const containerStyle = `max-width: 800px; margin: 0 auto; position: relative; aspect-ratio: 16/9;`;
  
  return `
  <div class="darrell-video-container" style="${containerStyle}">
    <div id="${uniqueId}-cover" class="video-cover" style="position: relative; cursor: pointer; width: 100%; height: 100%;" onclick="
      document.getElementById('${uniqueId}-cover').style.display='none';
      document.getElementById('${uniqueId}').style.display='block';
      document.getElementById('${uniqueId}').play();">
      <img src="${posterSrc}" alt="${altText}" style="width: 100%; height: 100%; object-fit: cover; display: block; border-radius: 8px;">
      <div class="play-button" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 60px; height: 60px; background-color: rgba(0, 0, 0, 0.7); border-radius: 50%; display: flex; justify-content: center; align-items: center;">
        <div style="width: 0; height: 0; border-style: solid; border-width: 10px 0 10px 20px; border-color: transparent transparent transparent #ffffff; margin-left: 5px;"></div>
      </div>
    </div>
    <video 
      id="${uniqueId}"
      controls
      width="100%"
      style="display: none; max-width: 100%; border-radius: 8px; aspect-ratio: 16/9;"
      src="${videoSrc}">
      您的瀏覽器不支援影片播放。
    </video>
  </div>`;
}

// 在HTML中使用此佔位符並隱藏瀏覽器預設播放按鈕的完整示例
function createCustomVideoPlayer(videoSrc, width, height) {
  // 創建容器
  const container = document.createElement('div');
  container.className = 'custom-video-container';
  container.style.position = 'relative';
  container.style.width = `${width}px`;
  container.style.height = `${height}px`;
  container.style.cursor = 'pointer';
  
  // 創建視頻元素
  const video = document.createElement('video');
  video.src = videoSrc;
  video.width = width;
  video.height = height;
  video.style.width = '100%';
  video.style.height = '100%';
  video.style.objectFit = 'cover';
  
  // 隱藏原生播放按鈕和控制項
  video.controls = false;
  
  // 創建自定義播放按鈕覆蓋層
  const overlay = document.createElement('div');
  overlay.className = 'video-overlay';
  overlay.style.position = 'absolute';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundImage = `url("${generateVideoPlaceholder(width, height)}")`;
  overlay.style.backgroundSize = 'cover';
  overlay.style.backgroundPosition = 'center';
  overlay.style.zIndex = '1';
  
  // 添加事件處理
  overlay.addEventListener('click', function() {
    if (video.paused) {
      video.play();
      overlay.style.display = 'none';
    }
  });
  
  video.addEventListener('pause', function() {
    overlay.style.display = 'block';
  });
  
  video.addEventListener('ended', function() {
    overlay.style.display = 'block';
  });
  
  // 組裝播放器
  container.appendChild(video);
  container.appendChild(overlay);
  
  return container;
}

function customVideoGradient(args) {
  let altText = args[0];
  let videoSrc = args[1];
  let posterImg = args[2];
  let className = args[3];
  let uniqueId = 'video-' + Math.random().toString(36).substr(2, 9);
  
  if(!className || className == ""){
    className = "max-800";
  }

  if(!altText || !videoSrc){
    return ``
  }
  
  // 直接使用預設 SVG
  let posterSrc = generateVideoPlaceholder(800, 450);
  
  return `
  <div class="darrell-video-container" style="max-width: 800px; margin: 0 auto; position: relative;">
    <div id="${uniqueId}-cover" class="video-cover" style="position: relative; cursor: pointer; overflow: hidden; border-radius: 8px;" onclick="
      document.getElementById('${uniqueId}-cover').style.display='none';
      document.getElementById('${uniqueId}').style.display='block';
      document.getElementById('${uniqueId}').play();">
      <img src="${posterSrc}" alt="${altText}" style="width: 100%; display: block; transition: transform 0.3s ease;">
      <div class="play-overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)); display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <div class="play-button" style="width: 70px; height: 70px; background-color: rgba(255, 255, 255, 0.9); border-radius: 50%; display: flex; justify-content: center; align-items: center; box-shadow: 0 0 15px rgba(0,0,0,0.3);">
          <div style="width: 0; height: 0; border-style: solid; border-width: 12px 0 12px 22px; border-color: transparent transparent transparent #333; margin-left: 5px;"></div>
        </div>
        <p style="color: white; margin-top: 15px; font-size: 16px; font-weight: 500;">點擊播放影片</p>
      </div>
    </div>
    <video 
      id="${uniqueId}"
      controls
      width="100%"
      style="display: none; max-width: 100%; border-radius: 8px;"
      src="${videoSrc}">
      您的瀏覽器不支援影片播放。
    </video>
  </div>
  <script>
  document.getElementById('${uniqueId}-cover').addEventListener('mouseover', function() {
    this.querySelector('img').style.transform = 'scale(1.05)';
  });
  document.getElementById('${uniqueId}-cover').addEventListener('mouseout', function() {
    this.querySelector('img').style.transform = 'scale(1)';
  });
  </script>`;
}

function customVideoLightbox(args) {
  let altText = args[0];
  let videoSrc = args[1];
  let posterImg = args[2];
  let className = args[3];
  let uniqueId = 'video-' + Math.random().toString(36).substr(2, 9);
  
  if(!className || className == ""){
    className = "max-800";
  }

  if(!altText || !videoSrc){
    return ``
  }
  
  // 直接使用預設 SVG
  let posterSrc = generateVideoPlaceholder(800, 450);
  
  return `
  <div class="darrell-video-lightbox" style="max-width: 800px; margin: 0 auto;">
    <div class="video-thumbnail" style="position: relative; cursor: pointer; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);" onclick="openVideoModal('${uniqueId}')">
      <img src="${posterSrc}" alt="${altText}" style="width: 100%; display: block; transition: all 0.3s ease;">
      <div class="play-indicator" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.2); display: flex; justify-content: center; align-items: center; transition: background-color 0.3s ease;">
        <div class="play-button" style="width: 80px; height: 80px; background-color: rgba(255,255,255,0.85); border-radius: 50%; display: flex; justify-content: center; align-items: center; transition: transform 0.2s ease, background-color 0.2s ease;">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5.14V19.14L19 12.14L8 5.14Z" fill="#333"/>
          </svg>
        </div>
      </div>
      <div class="video-info" style="position: absolute; bottom: 0; left: 0; width: 100%; padding: 15px; background: linear-gradient(transparent, rgba(0,0,0,0.7));">
        <p style="color: white; margin: 0; font-size: 16px; font-weight: 500;">${altText}</p>
      </div>
    </div>

    <div id="${uniqueId}-modal" class="video-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.9); z-index: 1000; justify-content: center; align-items: center; opacity: 0; transition: opacity 0.3s ease;">
      <div class="modal-content" style="position: relative; width: 90%; max-width: 900px;">
        <span class="close-modal" style="position: absolute; top: -40px; right: 0; color: white; font-size: 30px; cursor: pointer;" onclick="closeVideoModal('${uniqueId}')">&times;</span>
        <video id="${uniqueId}" controls width="100%" style="display: block; border-radius: 4px;" src="${videoSrc}">
          您的瀏覽器不支援影片播放。
        </video>
      </div>
    </div>
  </div>

  <script>
  if (!window.videoModalsInitialized) {
    window.videoModalsInitialized = true;
    window.openVideoModal = function(id) {
      const modal = document.getElementById(id + '-modal');
      modal.style.display = 'flex';
      setTimeout(() => {
        modal.style.opacity = '1';
      }, 10);
      document.getElementById(id).play();
      document.body.style.overflow = 'hidden';
    }
    
    window.closeVideoModal = function(id) {
      const modal = document.getElementById(id + '-modal');
      modal.style.opacity = '0';
      setTimeout(() => {
        modal.style.display = 'none';
        document.getElementById(id).pause();
      }, 300);
      document.body.style.overflow = '';
    }
  }
  
  // 確保縮圖有懸停效果
  document.querySelector('#${uniqueId}-modal').previousElementSibling.addEventListener('mouseover', function() {
    this.querySelector('img').style.transform = 'scale(1.05)';
    this.querySelector('.play-indicator').style.backgroundColor = 'rgba(0,0,0,0.4)';
    this.querySelector('.play-button').style.transform = 'scale(1.1)';
    this.querySelector('.play-button').style.backgroundColor = 'rgba(255,255,255,0.95)';
  });
  
  document.querySelector('#${uniqueId}-modal').previousElementSibling.addEventListener('mouseout', function() {
    this.querySelector('img').style.transform = 'scale(1)';
    this.querySelector('.play-indicator').style.backgroundColor = 'rgba(0,0,0,0.2)';
    this.querySelector('.play-button').style.transform = 'scale(1)';
    this.querySelector('.play-button').style.backgroundColor = 'rgba(255,255,255,0.85)';
  });
  </script>`;
}

hexo.extend.tag.register('darrellImage', customLightGallery, {ends: false});
hexo.extend.tag.register('darrellVideo', customVideoLightbox, {ends: false});
hexo.extend.tag.register('darrellOnlyImage', customOnlyImage, {ends: false});
hexo.extend.tag.register('darrellImage800', customLightGallery800, {ends: false});
hexo.extend.tag.register('darrellImageh800', customLightGallery800h, {ends: false});
hexo.extend.tag.register('darrellImageCover', customLightGalleryCover, {ends: false});
hexo.extend.tag.register('darrellVideoSimple', customVideoSimple, {ends: false});
hexo.extend.tag.register('darrellVideoGradient', customVideoGradient, {ends: false});
hexo.extend.tag.register('darrellVideoLightbox', customVideoLightbox, {ends: false});
