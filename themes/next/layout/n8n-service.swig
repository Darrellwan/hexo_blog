---
title: {{ page.title }}
date: {{ page.date }}
layout: false
---

{%- if theme.favicon.apple_touch_icon %}
  <link rel="apple-touch-icon" sizes="180x180" href="{{ url_for(theme.favicon.apple_touch_icon) }}">
{%- endif %}
{%- if theme.favicon.medium %}
  <link rel="icon" type="image/png" sizes="32x32" href="{{ url_for(theme.favicon.medium) }}">
{%- endif %}
{%- if theme.favicon.small %}
  <link rel="icon" type="image/png" sizes="16x16" href="{{ url_for(theme.favicon.small) }}">
{%- endif %}
{%- if theme.favicon.safari_pinned_tab %}
  <link rel="mask-icon" href="{{ url_for(theme.favicon.safari_pinned_tab) }}" color="{{ theme.android_chrome_color }}">
{%- endif %}
{%- if theme.favicon.android_manifest %}
  <link rel="manifest" href="{{ url_for(theme.favicon.android_manifest) }}">
{%- endif %}
{%- if theme.favicon.ms_browserconfig %}
  <meta name="msapplication-config" content="{{ url_for(theme.favicon.ms_browserconfig) }}">
{%- endif %}

{%- if theme.google_site_verification %}
  <meta name="google-site-verification" content="{{ theme.google_site_verification }}">
{%- endif %}

<!DOCTYPE html>
<html lang="zh-Hant-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>n8n 自動化服務 - 一對一家教、企業內訓、客製化流程 | Darrell TW</title>
  <meta name="description" content="提供專業的 n8n 自動化服務，包含一對一家教、團體內訓、自動化服務合作與客製化流程開發。協助您打造高效的工作流程自動化解決方案。">
  <meta name="keywords" content="n8n, 自動化服務, 一對一家教, 企業內訓, 客製化流程, 工作流程自動化">
  <link rel="canonical" href="{{ url_for(page.permalink) }}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="{{ url_for(page.permalink) }}">
  <meta property="og:title" content="n8n 自動化服務 - 一對一家教、企業內訓、客製化流程 | Darrell TW">
  <meta property="og:description" content="提供專業的 n8n 自動化服務，包含一對一家教、團體內訓、自動化服務合作與客製化流程開發。協助您打造高效的工作流程自動化解決方案。">
  <meta property="og:image" content="{{ url_for('/gallery/n8n_service_og.jpg') }}">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="{{ url_for(page.permalink) }}">
  <meta name="twitter:title" content="n8n 自動化服務 - 一對一家教、企業內訓、客製化流程 | Darrell TW">
  <meta name="twitter:description" content="提供專業的 n8n 自動化服務，包含一對一家教、團體內訓、自動化服務合作與客製化流程開發。協助您打造高效的工作流程自動化解決方案。">
  <meta name="twitter:image" content="{{ url_for('/gallery/n8n_service_og.jpg') }}">

  <script>
    // 初始化頁面功能
    window.onload = function() {
      // 平滑滾動效果
      document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
          e.preventDefault();
          const tgt = document.getElementById(a.getAttribute('href').slice(1));
          if (tgt) window.scrollTo({ top: tgt.offsetTop - 80, behavior: 'smooth' });
        });
      });
      
      // 服務卡片動畫
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      }, { threshold: 0.1 });
      
      document.querySelectorAll('.service-card, .form-step').forEach(card => {
        observer.observe(card);
      });
      
      // 表單步驟控制
      initializeForm();

      // 液體效果初始化
      initializeLiquidEffects();
      
      // 背景自動化動畫初始化
      initializeAutomationBackground();
    };

    // 自動化背景動畫
    function initializeAutomationBackground() {
      const canvas = document.getElementById('automation-bg');
      const ctx = canvas.getContext('2d');
      let animationId;
      
      // 設定 Canvas 尺寸
      function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      
      // n8n 服務節點類別
      class ServiceNode {
        constructor(x, y, service, size = 'normal') {
          this.x = x;
          this.y = y;
          this.service = service;
          this.size = size === 'large' ? 45 : 35;
          this.pulsePhase = Math.random() * Math.PI * 2;
          this.glowIntensity = 0;
          this.icon = this.getServiceIcon(service);
          this.color = this.getServiceColor(service);
        }
        
        getServiceIcon(service) {
          const icons = {
            'line': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-.72.46-2.03 1.33-.48.33-.91.49-1.3.48-.42-.01-1.25-.24-1.86-.44-.75-.24-1.35-.37-1.3-.78.03-.21.36-.42 1-.64 2.03-.84 3.38-1.39 4.07-1.66 1.94-.81 2.34-.95 2.6-.95.06 0 .19.01.28.09.08.05.1.14.11.19-.01.06-.01.24-.02.24z',
            'slack': 'M5.04 15.24c0 1.14-.92 2.06-2.06 2.06S.92 16.38.92 15.24s.92-2.06 2.06-2.06h2.06v2.06zm1.03 0c0-1.14.92-2.06 2.06-2.06s2.06.92 2.06 2.06v5.15c0 1.14-.92 2.06-2.06 2.06s-2.06-.92-2.06-2.06v-5.15zm2.06-10.13c-1.14 0-2.06-.92-2.06-2.06S6.99.99 8.13.99s2.06.92 2.06 2.06v2.06H8.13zm0 1.03c1.14 0 2.06.92 2.06 2.06s-.92 2.06-2.06 2.06H3.02c-1.14 0-2.06-.92-2.06-2.06s.92-2.06 2.06-2.06h5.11zm10.13 2.06c0-1.14.92-2.06 2.06-2.06s2.06.92 2.06 2.06-.92 2.06-2.06 2.06h-2.06V8.2zm-1.03 0c0 1.14-.92 2.06-2.06 2.06s-2.06-.92-2.06-2.06V3.05c0-1.14.92-2.06 2.06-2.06s2.06.92 2.06 2.06V8.2zm-2.06 10.13c1.14 0 2.06.92 2.06 2.06s-.92 2.06-2.06 2.06-2.06-.92-2.06-2.06v-2.06h2.06zm0-1.03c-1.14 0-2.06-.92-2.06-2.06s.92-2.06 2.06-2.06h5.11c1.14 0 2.06.92 2.06 2.06s-.92 2.06-2.06 2.06h-5.11z',
            'weather': 'M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z',
            'aggregate': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z M12 7v10l4.28 2.25-.68-4.87L19 11.09l-4.09-.59L12 7z',
            'split': 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z M14 8V3.5L18.5 8H14z M12 18H7v-2h5v2z M16 14H7v-2h9v2z M12 10H7V8h5v2z',
            'code': 'M8 3L4 7l4 4 1.5-1.5L7 7l2.5-2.5L8 3zM16 3l-1.5 1.5L17 7l-2.5 2.5L16 11l4-4-4-4z M11 4l-2 16h2l2-16h-2z',
            'webhook': 'M10 15l-3.5 3.5c-.39.39-1.02.39-1.41 0l-2.12-2.12c-.39-.39-.39-1.02 0-1.41L6.5 11.5c.39-.39 1.02-.39 1.41 0L10 13.59 14.5 9l-2.12-2.12c-.39-.39-.39-1.02 0-1.41l2.12-2.12c.39-.39 1.02-.39 1.41 0L20 7.59l1.41-1.41c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41L20 10.41l-4.09 4.09c-.39.39-1.02.39-1.41 0L12.38 12.38 10 15z',
            'schedule': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v6l5.25 3.15.75-1.23-4.5-2.67V7z',
            'http': 'M4.5 11h-2c-.83 0-1.5.67-1.5 1.5v3c0 .83.67 1.5 1.5 1.5h2c.83 0 1.5-.67 1.5-1.5v-3c0-.83-.67-1.5-1.5-1.5zm0 4h-2v-1h2v1zm6.5-4h-2c-.83 0-1.5.67-1.5 1.5v3c0 .83.67 1.5 1.5 1.5h2c.83 0 1.5-.67 1.5-1.5v-3c0-.83-.67-1.5-1.5-1.5zm0 4h-2v-1h2v1zm6.5-4h-2c-.83 0-1.5.67-1.5 1.5v3c0 .83.67 1.5 1.5 1.5h2c.83 0 1.5-.67 1.5-1.5v-3c0-.83-.67-1.5-1.5-1.5zm0 4h-2v-1h2v1zm3.5-8H2c-1.1 0-2 .9-2 2v2h24V5c0-1.1-.9-2-2-2z'
          };
          return icons[service] || icons['code'];
        }
        
        getServiceColor(service) {
          const colors = {
            'line': '#00C300',
            'slack': '#4A154B',
            'weather': '#61A9FF',
            'aggregate': '#FFB800',
            'split': '#FF6B6B',
            'code': '#8B5CF6',
            'webhook': '#10B981',
            'schedule': '#F59E0B',
            'http': '#EF4444'
          };
          return colors[service] || '#8B5CF6';
        }
        
        draw() {
          const pulse = Math.sin(this.pulsePhase) * 0.2 + 0.8;
          const currentSize = this.size * pulse;
          
          // 繪製節點背景
          const bgGradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, currentSize + 10);
          bgGradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
          bgGradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.08)');
          bgGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.fillStyle = bgGradient;
          ctx.beginPath();
          ctx.arc(this.x, this.y, currentSize + 10, 0, Math.PI * 2);
          ctx.fill();
          
          // 繪製節點主體（圓角矩形）
          const rectSize = currentSize;
          const radius = rectSize * 0.2;
          
          ctx.save();
          
          // 設定節點顏色
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.strokeStyle = `${this.color}40`; // 半透明邊框
          ctx.lineWidth = 2;
          
          // 繪製圓角矩形
          ctx.beginPath();
          ctx.roundRect(this.x - rectSize/2, this.y - rectSize/2, rectSize, rectSize, radius);
          ctx.fill();
          ctx.stroke();
          
          // 繪製圖標
          this.drawIcon(rectSize * 0.6);
          
          ctx.restore();
        }
        
        drawIcon(iconSize) {
          ctx.save();
          
          // 設定圖標顏色
          ctx.fillStyle = this.color;
          
          // 將座標系移到節點中心
          ctx.translate(this.x, this.y);
          
          // 縮放到適當大小
          const scale = iconSize / 24; // 假設原始圖標是 24x24
          ctx.scale(scale, scale);
          
          // 將圖標置中
          ctx.translate(-12, -12);
          
          // 繪製 SVG 路徑
          const path = new Path2D(this.icon);
          ctx.fill(path);
          
          ctx.restore();
        }
        
        update() {
          this.pulsePhase += 0.015; // 稍微慢一點的脈衝
        }
      }
      
      // 連接線類別（矩形路徑）
      class Connection {
        constructor(nodeA, nodeB) {
          this.nodeA = nodeA;
          this.nodeB = nodeB;
          this.particles = [];
          this.createPath();
          this.createParticles();
        }
        
        createPath() {
          // 創建矩形路徑，像真實的 n8n 工作流
          const dx = this.nodeB.x - this.nodeA.x;
          const dy = this.nodeB.y - this.nodeA.y;
          
          // 總是使用矩形路徑以保持 n8n 風格
          const midX = this.nodeA.x + dx * 0.6;
          this.pathPoints = [
            { x: this.nodeA.x, y: this.nodeA.y },
            { x: midX, y: this.nodeA.y },
            { x: midX, y: this.nodeB.y },
            { x: this.nodeB.x, y: this.nodeB.y }
          ];
          
          // 計算總路徑長度
          this.totalLength = 0;
          for (let i = 0; i < this.pathPoints.length - 1; i++) {
            const dx = this.pathPoints[i + 1].x - this.pathPoints[i].x;
            const dy = this.pathPoints[i + 1].y - this.pathPoints[i].y;
            this.totalLength += Math.sqrt(dx * dx + dy * dy);
          }
        }
        
        createParticles() {
          const particleCount = 1; // 每條線只有一個粒子
          for (let i = 0; i < particleCount; i++) {
            this.particles.push({
              progress: -0.2 - Math.random() * 0.5, // 隨機延遲啟動，避免同時出發
              speed: 0.002 + Math.random() * 0.001, // 慢一點的速度
              size: 2 + Math.random() * 1.5, // 粒子大小
              opacity: 0.9 + Math.random() * 0.1,
              sparkles: [], // 添加火花效果
              delay: Math.random() * 3000, // 隨機延遲時間（毫秒）
              lastTime: 0
            });
          }
        }
        
        draw() {
          // 繪製連接線，保持矩形路徑（加粗）
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 4;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          
          ctx.beginPath();
          ctx.moveTo(this.pathPoints[0].x, this.pathPoints[0].y);
          for (let i = 1; i < this.pathPoints.length; i++) {
            ctx.lineTo(this.pathPoints[i].x, this.pathPoints[i].y);
          }
          ctx.stroke();
          
          // 內部發光線（加粗）
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(this.pathPoints[0].x, this.pathPoints[0].y);
          for (let i = 1; i < this.pathPoints.length; i++) {
            ctx.lineTo(this.pathPoints[i].x, this.pathPoints[i].y);
          }
          ctx.stroke();
          
          // 繪製數據流粒子（增強閃電效果）
          this.particles.forEach(particle => {
            // 只繪製在可見範圍內的粒子
            if (particle.progress < 0 || particle.progress > 1) return;
            
            const pos = this.getPositionOnPath(particle.progress);
            
            // 外圈強烈發光效果
            const outerGlow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, particle.size * 8);
            outerGlow.addColorStop(0, `rgba(100, 200, 255, ${particle.opacity * 0.8})`);
            outerGlow.addColorStop(0.3, `rgba(255, 200, 100, ${particle.opacity * 0.6})`);
            outerGlow.addColorStop(0.6, `rgba(100, 200, 255, ${particle.opacity * 0.3})`);
            outerGlow.addColorStop(1, 'rgba(100, 200, 255, 0)');
            
            ctx.fillStyle = outerGlow;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, particle.size * 8, 0, Math.PI * 2);
            ctx.fill();
            
            // 中圈發光效果
            const innerGlow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, particle.size * 4);
            innerGlow.addColorStop(0, `rgba(255, 255, 255, ${particle.opacity})`);
            innerGlow.addColorStop(0.5, `rgba(100, 200, 255, ${particle.opacity * 0.7})`);
            innerGlow.addColorStop(1, 'rgba(100, 200, 255, 0)');
            
            ctx.fillStyle = innerGlow;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, particle.size * 4, 0, Math.PI * 2);
            ctx.fill();
            
            // 粒子核心（閃電白光）
            ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            
            // 添加隨機閃爍效果
            if (Math.random() < 0.3) {
              const sparkleSize = particle.size * 0.5;
              ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity * 0.8})`;
              for (let i = 0; i < 4; i++) {
                const angle = (i * Math.PI) / 2;
                const sparkleX = pos.x + Math.cos(angle) * sparkleSize * 3;
                const sparkleY = pos.y + Math.sin(angle) * sparkleSize * 3;
                ctx.beginPath();
                ctx.arc(sparkleX, sparkleY, sparkleSize * 0.3, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          });
        }
        
        getPositionOnPath(progress) {
          if (progress <= 0) return { x: this.pathPoints[0].x, y: this.pathPoints[0].y };
          if (progress >= 1) return { x: this.pathPoints[this.pathPoints.length - 1].x, y: this.pathPoints[this.pathPoints.length - 1].y };
          
          const targetLength = progress * this.totalLength;
          let currentLength = 0;
          
          for (let i = 0; i < this.pathPoints.length - 1; i++) {
            const segmentStart = this.pathPoints[i];
            const segmentEnd = this.pathPoints[i + 1];
            const dx = segmentEnd.x - segmentStart.x;
            const dy = segmentEnd.y - segmentStart.y;
            const segmentLength = Math.sqrt(dx * dx + dy * dy);
            
            if (currentLength + segmentLength >= targetLength) {
              const segmentProgress = (targetLength - currentLength) / segmentLength;
              return {
                x: segmentStart.x + dx * segmentProgress,
                y: segmentStart.y + dy * segmentProgress
              };
            }
            
            currentLength += segmentLength;
          }
          
          return this.pathPoints[this.pathPoints.length - 1];
        }
        
        update() {
          const currentTime = Date.now();
          
          this.particles.forEach(particle => {
            // 檢查延遲時間
            if (currentTime - particle.lastTime < particle.delay && particle.progress < 0) {
              return; // 還在延遲期間，不移動
            }
            
            particle.progress += particle.speed;
            if (particle.progress > 1.2) { // 讓粒子完全消失後才重置
              particle.progress = -0.2 - Math.random() * 0.3; // 重新隨機延遲
              particle.speed = 0.002 + Math.random() * 0.001;
              particle.delay = 2000 + Math.random() * 4000; // 隨機 2-6 秒延遲
              particle.lastTime = currentTime;
              // 重置時添加閃光效果
              particle.opacity = 0.9 + Math.random() * 0.1;
            }
            
            // 只有在可見範圍內才添加閃爍效果
            if (particle.progress >= 0 && particle.progress <= 1) {
              // 添加隨機閃爍效果
              if (Math.random() < 0.05) { // 降低閃爍頻率
                particle.opacity = Math.min(1, particle.opacity + 0.15);
              } else {
                particle.opacity = Math.max(0.6, particle.opacity - 0.01);
              }
            }
          });
        }
      }
      
      // 初始化 n8n 服務節點網絡
      let nodes = [];
      let connections = [];
      
      function initializeNetwork() {
        nodes = [];
        connections = [];
        
        // 定義工作流佈局：觸發器 -> 處理 -> 輸出（簡化版）
        const workflowConfig = [
          // 觸發器
          { service: 'schedule', x: 0.15, y: 0.3, size: 'large', label: 'Schedule Trigger' },
          { service: 'webhook', x: 0.15, y: 0.7, size: 'large', label: 'Webhook' },
          
          // 數據獲取
          { service: 'slack', x: 0.4, y: 0.2, size: 'normal', label: 'Slack' },
          { service: 'line', x: 0.4, y: 0.5, size: 'normal', label: 'LINE' },
          { service: 'http', x: 0.4, y: 0.8, size: 'normal', label: 'HTTP Request' },
          
          // 數據處理
          { service: 'code', x: 0.65, y: 0.35, size: 'normal', label: 'Code' },
          { service: 'aggregate', x: 0.65, y: 0.65, size: 'normal', label: 'Aggregate' },
          
          // 最終輸出
          { service: 'webhook', x: 0.85, y: 0.5, size: 'large', label: 'Final Output' }
        ];
        
        // 創建節點
        workflowConfig.forEach((config, index) => {
          const node = new ServiceNode(
            canvas.width * config.x,
            canvas.height * config.y,
            config.service,
            config.size
          );
          node.index = index;
          node.label = config.label;
          nodes.push(node);
        });
        
        // 定義工作流連接（簡化版）
        const connectionPairs = [
          // 觸發器到數據獲取
          [0, 2], // Schedule -> Slack
          [0, 3], // Schedule -> LINE
          [1, 4], // Webhook -> HTTP
          
          // 數據獲取到處理
          [2, 5], // Slack -> Code
          [3, 6], // LINE -> Aggregate
          [4, 5], // HTTP -> Code
          
          // 處理到最終輸出
          [5, 7], // Code -> Final Output
          [6, 7]  // Aggregate -> Final Output
        ];
        
        // 創建連接
        connectionPairs.forEach(([a, b]) => {
          if (nodes[a] && nodes[b]) {
            connections.push(new Connection(nodes[a], nodes[b]));
          }
        });
      }
      
      // 動畫循環
      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 更新和繪製連接線
        connections.forEach(connection => {
          connection.update();
          connection.draw();
        });
        
        // 更新和繪製節點
        nodes.forEach(node => {
          node.update();
          node.draw();
        });
        
        animationId = requestAnimationFrame(animate);
      }
      
      // 響應視窗大小變化
      window.addEventListener('resize', () => {
        resizeCanvas();
        initializeNetwork();
      });
      
      // 啟動動畫
      resizeCanvas();
      initializeNetwork();
      animate();
      
      // 清理函數
      return () => {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
        window.removeEventListener('resize', resizeCanvas);
      };
    }

    // 液體玻璃效果
    function initializeLiquidEffects() {
      // 鼠標跟隨液體效果（排除表單相關元素和成功訊息）
      document.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll('.liquid-card:not(.form-container):not(.service-option):not(.success-message)');
        cards.forEach(card => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            card.style.transform = `perspective(1000px) rotateX(${deltaY * 5}deg) rotateY(${deltaX * 5}deg) translateZ(10px)`;
            
            // 更新液體光暈位置
            const glow = card.querySelector('.liquid-glow');
            if (glow) {
              glow.style.background = `radial-gradient(600px at ${x}px ${y}px, rgba(255, 140, 0, 0.15), transparent 40%)`;
            }
          }
        });
      });

      // 鼠標離開時重置（排除表單相關元素和成功訊息）
      document.querySelectorAll('.liquid-card:not(.form-container):not(.service-option):not(.success-message)').forEach(card => {
        card.addEventListener('mouseleave', () => {
          card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
      });
    }
    
    function initializeForm() {
      const form = document.getElementById('service-form');
      const steps = document.querySelectorAll('.form-step');
      const progressBar = document.querySelector('.progress-fill');
      const stepIndicators = document.querySelectorAll('.step-indicator');
      let currentStep = 0;
      
      // 設定即時驗證
      setupRealtimeValidation();
      
      // 更新進度條
      function updateProgress() {
        const progress = ((currentStep + 1) / steps.length) * 100;
        progressBar.style.width = progress + '%';
        
        // 更新步驟指示器
        stepIndicators.forEach((indicator, index) => {
          if (index <= currentStep) {
            indicator.classList.add('active');
          } else {
            indicator.classList.remove('active');
          }
        });
      }
      
      // 顯示特定步驟
      function showStep(stepIndex) {
        steps.forEach((step, index) => {
          if (index === stepIndex) {
            step.classList.add('active');
            step.style.display = 'block';
            setTimeout(() => {
              step.style.opacity = '1';
              step.style.transform = 'translateY(0)';
            }, 50);
          } else {
            step.style.opacity = '0';
            step.style.transform = 'translateY(20px)';
            setTimeout(() => {
              step.classList.remove('active');
              step.style.display = 'none';
            }, 300);
          }
        });
        updateProgress();
        
        // 在第四步時檢查是否需要顯示預算
        if (stepIndex === 3) {
          updateBudgetVisibility();
        }
      }
      
      // 下一步
      window.nextStep = function() {
        if (validateStep(currentStep)) {
          if (currentStep < steps.length - 1) {
            currentStep++;
            showStep(currentStep);
          }
        }
      }
      
      // 上一步
      window.prevStep = function() {
        if (currentStep > 0) {
          currentStep--;
          showStep(currentStep);
        }
      }
      
      // 驗證步驟
      function validateStep(stepIndex) {
        const currentStepElement = steps[stepIndex];
        const allFields = currentStepElement.querySelectorAll('input, select, textarea');
        let isValid = true;
        let errorMessages = [];
        
        allFields.forEach(field => {
          const fieldValue = field.value.trim();
          const isRequired = field.hasAttribute('required');
          
          // 跳過隱藏欄位
          if (field.type === 'hidden') return;
          
          field.classList.remove('error');
          
          // 基本必填驗證
          if (isRequired && !fieldValue) {
            field.classList.add('error');
            isValid = false;
            errorMessages.push(`${field.previousElementSibling.textContent.replace(' *', '')} 為必填欄位`);
            return;
          }
          
          // 只有在有值的情況下才進行格式驗證
          if (fieldValue) {
            // Email 驗證
            if (field.type === 'email') {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(fieldValue)) {
                field.classList.add('error');
                isValid = false;
                errorMessages.push('請輸入有效的電子郵件地址');
              }
            }
            
            // 電話驗證（台灣手機號碼）
            if (field.type === 'tel') {
              const cleanPhone = fieldValue.replace(/[-\s]/g, '');
              const phoneRegex = /^09\d{8}$/;
              if (!phoneRegex.test(cleanPhone)) {
                field.classList.add('error');
                isValid = false;
                errorMessages.push('請輸入有效的台灣手機號碼（例：0912345678）');
              }
            }
          }
        });
        
        // 顯示錯誤訊息
        if (!isValid && errorMessages.length > 0) {
          showErrorMessage(errorMessages[0]);
        }
        
        return isValid;
      }
      
      // 顯示錯誤訊息
      function showErrorMessage(message) {
        const existingError = document.querySelector('.error-toast');
        if (existingError) {
          existingError.remove();
        }
        
        const errorToast = document.createElement('div');
        errorToast.className = 'error-toast';
        errorToast.textContent = message;
        document.body.appendChild(errorToast);
        
        setTimeout(() => {
          errorToast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
          errorToast.classList.remove('show');
          setTimeout(() => errorToast.remove(), 300);
        }, 3000);
      }
      
      // 設定即時驗證
      function setupRealtimeValidation() {
        // Email 欄位即時驗證
        const emailField = document.getElementById('email');
        if (emailField) {
          emailField.addEventListener('blur', function() {
            validateField(this);
          });
          
          emailField.addEventListener('input', function() {
            // 移除錯誤狀態當使用者開始輸入
            if (this.classList.contains('error')) {
              this.classList.remove('error');
              removeFieldError(this);
            }
          });
        }
        
        // 電話欄位即時驗證
        const phoneField = document.getElementById('phone');
        if (phoneField) {
          phoneField.addEventListener('blur', function() {
            if (this.value.trim()) { // 只有在有值的時候才驗證
              validateField(this);
            }
          });
          
          phoneField.addEventListener('input', function() {
            // 移除錯誤狀態當使用者開始輸入
            if (this.classList.contains('error')) {
              this.classList.remove('error');
              removeFieldError(this);
            }
          });
        }
      }
      
      // 驗證單一欄位
      function validateField(field) {
        const fieldValue = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Email 驗證
        if (field.type === 'email' && fieldValue) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(fieldValue)) {
            isValid = false;
            errorMessage = '請輸入有效的電子郵件地址';
          }
        }
        
        // 電話驗證（台灣手機號碼）
        if (field.type === 'tel' && fieldValue) {
          const cleanPhone = fieldValue.replace(/[-\s]/g, '');
          const phoneRegex = /^09\d{8}$/;
          if (!phoneRegex.test(cleanPhone)) {
            isValid = false;
            errorMessage = '請輸入有效的電話（例：0912345678）';
          }
        }
        
        // 顯示或移除錯誤
        if (!isValid) {
          field.classList.add('error');
          showFieldError(field, errorMessage);
        } else {
          field.classList.remove('error');
          removeFieldError(field);
        }
        
        return isValid;
      }
      
      // 顯示欄位錯誤訊息
      function showFieldError(field, message) {
        removeFieldError(field); // 先移除舊的錯誤訊息
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error-message';
        errorElement.textContent = message;
        field.parentElement.appendChild(errorElement);
      }
      
      // 移除欄位錯誤訊息
      function removeFieldError(field) {
        const existingError = field.parentElement.querySelector('.field-error-message');
        if (existingError) {
          existingError.remove();
        }
      }
      
      // 服務選擇
      const serviceCards = document.querySelectorAll('.service-option');
      serviceCards.forEach(card => {
        card.addEventListener('click', function() {
          serviceCards.forEach(c => c.classList.remove('selected'));
          this.classList.add('selected');
          document.getElementById('selected-service').value = this.dataset.service;
          
          // 選擇服務後自動前往下一步
          setTimeout(() => {
            if (currentStep === 0 && validateStep(currentStep)) {
              nextStep();
            }
          }, 300); // 短暫延遲讓用戶看到選中效果
          
          // 當進入第四步時更新預算可見性
          if (currentStep === 3) {
            updateBudgetVisibility();
          }
        });
      });
      
      // 預算範圍滑桿
      const budgetSlider = document.getElementById('budget-range');
      const budgetDisplay = document.getElementById('budget-display');
      const budgetGroup = document.querySelector('.budget-group');
      
      // 根據服務類型決定是否顯示預算
      function updateBudgetVisibility() {
        const selectedService = document.getElementById('selected-service').value;
        if (selectedService === 'consulting' || selectedService === 'custom') {
          budgetGroup.style.display = 'block';
        } else {
          budgetGroup.style.display = 'none';
        }
      }
      
      if (budgetSlider) {
        budgetSlider.addEventListener('input', function() {
          const value = this.value;
          const budgetTexts = ['尚未確定', '< NT$ 30,000', 'NT$ 30,000 - 50,000', 'NT$ 50,000 - 100,000', 'NT$ 100,000 - 200,000', '> NT$ 200,000'];
          budgetDisplay.textContent = budgetTexts[value];
          
          // 更新滑桿填充效果
          const percentage = (value / 5) * 100;
          this.style.background = `linear-gradient(to right, var(--primary-color) 0%, var(--primary-color) ${percentage}%, var(--border-color) ${percentage}%, var(--border-color) 100%)`;
        });
        
        // 初始化滑桿樣式
        budgetSlider.style.background = `linear-gradient(to right, var(--primary-color) 0%, var(--primary-color) 0%, var(--border-color) 0%, var(--border-color) 100%)`;
      }
      
      // 表單提交
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateStep(currentStep)) {
          // 收集所有表單數據
          const formData = new FormData(form);
          const data = Object.fromEntries(formData);
          
          // 處理服務名稱
          const serviceNames = {
            'tutoring': '一對一家教',
            'training': '團體內訓',
            'consulting': '自動化服務合作',
            'custom': '客製自動化流程'
          };
          data.serviceName = serviceNames[data.service] || data.service;
          
          // 處理預算顯示
          if (data.budget) {
            const budgetTexts = ['尚未確定', '< NT$ 30,000', 'NT$ 30,000 - 50,000', 'NT$ 50,000 - 100,000', 'NT$ 100,000 - 200,000', '> NT$ 200,000'];
            data.budgetText = budgetTexts[data.budget] || '尚未確定';
          }
          
          // 顯示提交動畫
          const submitBtn = form.querySelector('.submit-btn');
          const originalText = submitBtn.innerHTML;
          submitBtn.innerHTML = '<span class="loading-spinner"></span> 提交中...';
          submitBtn.disabled = true;
          
          // 真實提交到 webhook
          fetch('https://darrellinfo-n8n.hnd1.zeabur.app/webhook/website-service-form', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
          })
          .then(response => {
            if (response.ok) {
              return response.json().catch(() => ({})); // 如果沒有 JSON 回應就返回空物件
            } else {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
          })
          .then(result => {
            console.log('提交成功:', result);
            showSuccessMessage(data);
          })
          .catch(error => {
            console.error('提交失敗:', error);
            // 顯示錯誤訊息
            showErrorMessage('提交失敗，請稍後再試或直接聯繫我們。錯誤：' + error.message);
            // 恢復按鈕
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
          });
        }
      });
      
      // 顯示成功訊息
      function showSuccessMessage(data) {
        const formContainer = document.querySelector('.form-container');
        
        // 建立提交資料摘要
        let summaryHTML = '<div class="submission-summary">';
        summaryHTML += '<h4>您提交的資訊：</h4>';
        summaryHTML += '<div class="summary-items">';
        
        // 基本資訊
        summaryHTML += `<div class="summary-item"><strong>服務類型：</strong>${data.serviceName}</div>`;
        summaryHTML += `<div class="summary-item"><strong>姓名：</strong>${data.name}</div>`;
        if (data.company) {
          summaryHTML += `<div class="summary-item"><strong>公司/組織：</strong>${data.company}</div>`;
        }
        summaryHTML += `<div class="summary-item"><strong>電子郵件：</strong>${data.email}</div>`;
        if (data.phone) {
          summaryHTML += `<div class="summary-item"><strong>聯絡電話：</strong>${data.phone}</div>`;
        }
        
        // 需求資訊
        if (data.current_situation) {
          summaryHTML += `<div class="summary-item"><strong>目前狀況：</strong>${data.current_situation}</div>`;
        }
        if (data.expected_outcome) {
          summaryHTML += `<div class="summary-item"><strong>期望目標：</strong>${data.expected_outcome}</div>`;
        }
        if (data.timeline) {
          const timelineText = {
            'immediate': '立即開始',
            '1month': '1 個月內',
            '3months': '3 個月內',
            'flexible': '時間彈性'
          };
          summaryHTML += `<div class="summary-item"><strong>預計時程：</strong>${timelineText[data.timeline] || data.timeline}</div>`;
        }
        
        // 預算（如果有）
        if (data.budgetText && (data.service === 'consulting' || data.service === 'custom')) {
          summaryHTML += `<div class="summary-item"><strong>預算範圍：</strong>${data.budgetText}</div>`;
        }
        
        // 其他資訊
        if (data.additional_info) {
          summaryHTML += `<div class="summary-item"><strong>補充說明：</strong>${data.additional_info}</div>`;
        }
        if (data.newsletter === 'yes') {
          summaryHTML += `<div class="summary-item"><strong>訂閱電子報：</strong>是</div>`;
        }
        
        summaryHTML += '</div></div>';
        
        formContainer.innerHTML = `
          <div class="success-message">
            <div class="success-animation">
              <div class="success-icon">
                <svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="26" cy="26" r="25" fill="none" stroke="currentColor" stroke-width="2"/>
                  <path fill="none" stroke="currentColor" stroke-width="3" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
              </div>
              <div class="success-ripple"></div>
            </div>
            <h3>感謝您的諮詢！</h3>
            <p class="success-subtitle">我們已收到您的需求，將在 24 小時內與您聯繫。</p>
            
            <div class="contact-info-card">
              <div class="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <div class="info-content">
                <p class="info-label">我們將透過以下方式聯繫您</p>
                <p class="info-value">${data.email}</p>
                ${data.phone ? `<p class="info-value">${data.phone}</p>` : ''}
              </div>
            </div>
            
            ${summaryHTML}
            
            <div class="success-actions">
              <button onclick="location.reload()" class="btn btn-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 4v6h6M23 20v-6h-6"/>
                  <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/>
                </svg>
                重新填寫
              </button>
              <a href="/" class="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                返回首頁
              </a>
            </div>
          </div>
        `;
      }
      
      // 初始化顯示第一步
      showStep(0);
    }
    
    // Debug 函數 - 用於 Chrome console 測試
    window.debugSubmitForm = function(customData = {}) {
      // 預設測試數據
      const defaultTestData = {
        service: 'tutoring',
        serviceName: '一對一家教',
        name: '測試用戶',
        company: '測試公司',
        email: 'test@example.com',
        phone: '0912345678',
        current_situation: '目前需要學習 n8n 自動化流程，希望能夠建立有效的工作流程',
        expected_outcome: '希望能夠獨立建立和維護 n8n 工作流程，提升工作效率',
        timeline: 'immediate',
        budget: '2',
        budgetText: 'NT$ 30,000 - 50,000',
        additional_info: '這是透過 debug 函數提交的測試數據',
        newsletter: 'yes'
      };
      
      // 合併自定義數據
      const testData = { ...defaultTestData, ...customData };
      
      console.log('🚀 開始測試表單提交...');
      console.log('📋 提交數據:', testData);
      
      // 發送請求
      fetch('https://darrellinfo-n8n.hnd1.zeabur.app/webhook/website-service-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      })
      .then(response => {
        console.log('📡 HTTP 狀態:', response.status, response.statusText);
        if (response.ok) {
          return response.json().catch(() => {
            console.log('ℹ️ 回應沒有 JSON 內容');
            return {};
          });
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      })
      .then(result => {
        console.log('✅ 提交成功!');
        console.log('📦 伺服器回應:', result);
        return result;
      })
      .catch(error => {
        console.error('❌ 提交失敗:', error.message);
        console.error('🔍 詳細錯誤:', error);
        throw error;
      });
      
      return '測試提交已發送，請查看 console 輸出';
    };    
  </script>

<script>
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WRZDBFS')
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "n8n 自動化服務",
  "provider": {
    "@type": "Person",
    "name": "Darrell TW"
  },
  "description": "提供專業的 n8n 自動化服務，包含一對一家教、團體內訓、自動化服務合作與客製化流程開發",
  "serviceType": ["教育訓練", "技術諮詢", "軟體開發"],
  "areaServed": {
    "@type": "Country",
    "name": "Taiwan"
  }
}
</script>
</head>
<body>
<!-- 自動化背景動畫 -->
<canvas id="automation-bg" class="automation-background"></canvas>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WRZDBFS"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->

<nav class="service-nav liquid-nav">
  <div class="liquid-glow"></div>
  <div class="nav-container">
    <a href="/" class="nav-logo">Darrell TW</a>
    <div class="nav-links">
      <a href="/n8n-tutorial-resources/">n8n 教學文件</a>
      <a href="#services">服務項目</a>
      <a href="#contact" class="nav-cta">立即諮詢</a>
    </div>
  </div>
</nav>

<main class="service-container">
  <div class="page-header">
    <h1>n8n 自動化服務</h1>
    <p>專業的工作流程自動化解決方案，讓您的業務運作更高效、更智能</p>
  </div>

  <section id="services" class="services-section">
    <div class="section-header">
      <h2>服務項目</h2>
      <p>提供全方位的 n8n 自動化服務，滿足不同需求</p>
    </div>
    
    <div class="services-grid">
      <div class="service-card liquid-card" data-service="tutoring">
        <div class="liquid-glow"></div>
        <div class="service-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 10H7"></path>
            <path d="M19 6H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2z"></path>
            <path d="M12 14v7"></path>
            <path d="M8 21h8"></path>
            <circle cx="17" cy="10" r="1" fill="currentColor"></circle>
            <path d="M5 10h.01"></path>
          </svg>
        </div>
        <h3>一對一家教</h3>
        <p>客製化的個人教學計畫，從基礎概念到進階技巧，依照您的學習步調和需求調整課程內容。</p>
        <ul class="service-features">
          <li>彈性的上課時間安排</li>
          <li>量身定制的課程內容</li>
          <li>實作導向的教學方式</li>
          <li>課後持續支援與解答</li>
        </ul>
      </div>
      
      <div class="service-card liquid-card" data-service="training">
        <div class="liquid-glow"></div>
        <div class="service-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 20v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 20v-2a4 4 0 00-3-3.87"></path>
            <path d="M16 3.13a4 4 0 010 7.75"></path>
          </svg>
        </div>
        <h3>團體內訓</h3>
        <p>為企業團隊設計的完整培訓方案，提升整體團隊的自動化能力，加速數位轉型。</p>
        <ul class="service-features">
          <li>系統化的課程規劃</li>
          <li>團隊協作實戰演練</li>
          <li>企業案例分析討論</li>
          <li>培訓成效追蹤評估</li>
        </ul>
      </div>
      
      <div class="service-card liquid-card" data-service="consulting">
        <div class="liquid-glow"></div>
        <div class="service-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
            <circle cx="8.5" cy="7" r="4"></circle>
            <polyline points="17 11 19 13 23 9"></polyline>
          </svg>
        </div>
        <h3>自動化服務合作</h3>
        <p>協助企業評估、規劃並導入 n8n 自動化解決方案，優化現有工作流程，提升營運效率。</p>
        <ul class="service-features">
          <li>流程分析與優化建議</li>
          <li>技術架構規劃設計</li>
          <li>系統整合與部署支援</li>
          <li>長期維護合作方案</li>
        </ul>
      </div>
      
      <div class="service-card liquid-card" data-service="custom">
        <div class="liquid-glow"></div>
        <div class="service-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            <path d="M12 17.77V22"></path>
            <path d="M8.5 12.5L7 14"></path>
            <path d="M15.5 12.5L17 14"></path>
          </svg>
        </div>
        <h3>客製自動化流程</h3>
        <p>根據您的特定業務需求，設計開發專屬的自動化工作流程，完美契合您的營運模式。</p>
        <ul class="service-features">
          <li>需求分析與流程設計</li>
          <li>客製化節點開發</li>
          <li>第三方服務整合</li>
          <li>完整文件與教育訓練</li>
        </ul>
      </div>
    </div>
  </section>
  
  <section id="contact" class="contact-section">
    <div class="section-header">
      <h2>立即開始您的自動化之旅</h2>
      <p>填寫表單，讓我們瞭解您的需求</p>
    </div>
    
    <div class="form-container liquid-card">
      <div class="liquid-glow"></div>
      <!-- 進度條 -->
      <div class="form-progress">
        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>
        <div class="step-indicators">
          <div class="step-indicator active">1</div>
          <div class="step-indicator">2</div>
          <div class="step-indicator">3</div>
          <div class="step-indicator">4</div>
        </div>
      </div>
      
      <form id="service-form" action="" method="POST">
        <!-- 步驟 1: 選擇服務 -->
        <div class="form-step active">
          <h3>選擇您需要的服務</h3>
          <div class="form-content">
            <div class="service-options">
              <div class="service-option liquid-card" data-service="tutoring">
                <div class="liquid-glow"></div>
                <div class="option-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 10H7"></path>
                    <path d="M19 6H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2z"></path>
                    <path d="M12 14v7"></path>
                    <path d="M8 21h8"></path>
                    <circle cx="17" cy="10" r="1" fill="currentColor"></circle>
                    <path d="M5 10h.01"></path>
                  </svg>
                </div>
                <h4>一對一家教</h4>
                <p>個人化教學方案</p>
              </div>
              <div class="service-option liquid-card" data-service="training">
                <div class="liquid-glow"></div>
                <div class="option-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 20v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 20v-2a4 4 0 00-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 010 7.75"></path>
                  </svg>
                </div>
                <h4>團體內訓</h4>
                <p>企業團隊培訓</p>
              </div>
              <div class="service-option liquid-card" data-service="consulting">
                <div class="liquid-glow"></div>
                <div class="option-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <polyline points="17 11 19 13 23 9"></polyline>
                  </svg>
                </div>
                <h4>自動化服務合作</h4>
                <p>導入解決方案</p>
              </div>
              <div class="service-option liquid-card" data-service="custom">
                <div class="liquid-glow"></div>
                <div class="option-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    <path d="M12 17.77V22"></path>
                    <path d="M8.5 12.5L7 14"></path>
                    <path d="M15.5 12.5L17 14"></path>
                  </svg>
                </div>
                <h4>客製自動化流程</h4>
                <p>專屬流程開發</p>
              </div>
            </div>
            <input type="hidden" id="selected-service" name="service" required>
          </div>
          <div class="form-navigation">
            <button type="button" class="btn btn-primary" onclick="nextStep()">下一步</button>
          </div>
        </div>
        
        <!-- 步驟 2: 基本資訊 -->
        <div class="form-step">
          <h3>請告訴我們您的基本資訊</h3>
          <div class="form-content">
            <div class="form-group">
              <label for="name">姓名 *</label>
              <input type="text" id="name" name="name" required placeholder="請輸入您的姓名">
            </div>
            <div class="form-group">
              <label for="company">公司/組織</label>
              <input type="text" id="company" name="company" placeholder="請輸入公司或組織名稱">
            </div>
            <div class="form-group">
              <label for="email">電子郵件 *</label>
              <input type="email" id="email" name="email" required placeholder="example@email.com">
            </div>
            <div class="form-group">
              <label for="phone">聯絡電話</label>
              <input type="tel" id="phone" name="phone" placeholder="0912-345-678">
            </div>
          </div>
          <div class="form-navigation">
            <button type="button" class="btn btn-secondary" onclick="prevStep()">上一步</button>
            <button type="button" class="btn btn-primary" onclick="nextStep()">下一步</button>
          </div>
        </div>
        
        <!-- 步驟 3: 需求詳情 -->
        <div class="form-step">
          <h3>請描述您的需求</h3>
          <div class="form-content">
            <div class="form-group">
              <label for="current-situation">目前的狀況或挑戰</label>
              <textarea id="current-situation" name="current_situation" rows="3" placeholder="請簡述您目前遇到的問題或想要改善的流程"></textarea>
            </div>
            <div class="form-group">
              <label for="expected-outcome">期望達成的目標</label>
              <textarea id="expected-outcome" name="expected_outcome" rows="3" placeholder="請描述您希望透過自動化達成什麼目標"></textarea>
            </div>
            <div class="form-group">
              <label for="timeline">預計時程</label>
              <select id="timeline" name="timeline">
                <option value="">請選擇</option>
                <option value="immediate">立即開始</option>
                <option value="1month">1 個月內</option>
                <option value="3months">3 個月內</option>
                <option value="flexible">時間彈性</option>
              </select>
            </div>
          </div>
          <div class="form-navigation">
            <button type="button" class="btn btn-secondary" onclick="prevStep()">上一步</button>
            <button type="button" class="btn btn-primary" onclick="nextStep()">下一步</button>
          </div>
        </div>
        
        <!-- 步驟 4: 預算與其他 -->
        <div class="form-step">
          <h3>最後一步</h3>
          <div class="form-content">
            <div class="form-group budget-group" style="display: none;">
              <label for="budget-range">專案預算範圍</label>
              <div class="budget-slider">
                <div class="budget-track">
                  <input type="range" id="budget-range" name="budget" min="0" max="5" value="0">
                  <div class="budget-markers">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div class="budget-display" id="budget-display">尚未確定</div>
                <div class="budget-hint">請選擇您的預算範圍，有助於我們提供更適合的方案</div>
              </div>
            </div>
            <div class="form-group">
              <label for="additional-info">其他補充說明</label>
              <textarea id="additional-info" name="additional_info" rows="3" placeholder="如有其他想要告訴我們的資訊，請在此填寫"></textarea>
            </div>
            <div class="form-group checkbox-group">
              <label>
                <input type="checkbox" name="newsletter" value="yes">
                <span>我願意接收 n8n 相關的教學資訊與更新</span>
              </label>
            </div>
          </div>
          <div class="form-navigation">
            <button type="button" class="btn btn-secondary" onclick="prevStep()">上一步</button>
            <button type="submit" class="btn btn-primary submit-btn">提交諮詢</button>
          </div>
        </div>
      </form>
    </div>
  </section>
</main>

<footer class="service-footer">
  <p>&copy; {% if date %}{{ date(now, 'YYYY') }}{% else %}2025{% endif %} Darrell TW - n8n 自動化服務</p>
</footer>

<style>
  :root {
    /* 橘色系配色方案 */
    --primary-color: #ff6d5a;
    --primary-light: #ff8e53;
    --primary-dark: #e55347;
    --secondary-color: #ffa726;
    --accent-color: #ff7043;
    
    /* 液體玻璃系統 */
    --glass-bg: rgba(255, 109, 90, 0.08);
    --glass-border: rgba(255, 140, 0, 0.2);
    --glass-shadow: 0 8px 32px rgba(255, 109, 90, 0.1);
    --glass-shadow-hover: 0 12px 40px rgba(255, 109, 90, 0.2);
    
    /* 背景與文字 */
    --bg-dark: #0a0a0a;
    --bg-card: rgba(26, 26, 26, 0.7);
    --bg-hover: rgba(42, 42, 42, 0.8);
    --text-primary: #ffffff;
    --text-secondary: #b0b0b0;
    --text-tertiary: #888888;
    --border-color: rgba(255, 109, 90, 0.15);
    
    /* 動畫與效果 */
    --transition-base: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-slow: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    --backdrop-blur: blur(20px);
    
    --success-color: #4caf50;
    --error-color: #f44336;
  }
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #2d1b2d 100%);
    color: var(--text-primary);
    line-height: 1.6;
    overflow-x: hidden;
    padding-top: 60px;
    position: relative;
    min-height: 100vh;
  }
  
  /* 自動化背景動畫 */
  .automation-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -2;
    opacity: 0.3;
    pointer-events: none;
  }
  
  /* 液體玻璃基礎類 */
  .liquid-card {
    position: relative;
    background: rgba(255, 109, 90, 0.08);
    backdrop-filter: blur(25px) saturate(180%);
    -webkit-backdrop-filter: blur(25px) saturate(180%);
    border: 1px solid rgba(255, 140, 0, 0.3);
    border-radius: 20px;
    transition: var(--transition-base);
    overflow: hidden;
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      inset 0 -1px 0 rgba(255, 255, 255, 0.05);
  }
  
  .liquid-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.05) 50%,
      rgba(255, 255, 255, 0.02) 100%);
    pointer-events: none;
    z-index: 1;
  }
  
  .liquid-glow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(600px at 50% 50%, rgba(255, 140, 0, 0.15), transparent 40%);
    opacity: 0;
    transition: var(--transition-base);
    pointer-events: none;
    z-index: 2;
  }
  
  .liquid-card:hover .liquid-glow {
    opacity: 1;
  }
  
  .liquid-card:hover {
    transform: translateY(-5px);
    box-shadow: 
      0 20px 60px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(255, 140, 0, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.2),
      inset 0 -1px 0 rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 140, 0, 0.6);
    background: rgba(255, 109, 90, 0.12);
  }
  
  /* 液體導航 */
  .liquid-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    padding: 1rem 0;
    background: rgba(255, 109, 90, 0.06);
    backdrop-filter: blur(30px) saturate(180%);
    -webkit-backdrop-filter: blur(30px) saturate(180%);
    border-bottom: 1px solid rgba(255, 140, 0, 0.25);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    transition: var(--transition-base);
  }
  
  .liquid-nav:hover {
    background: rgba(255, 109, 90, 0.1);
    border-bottom-color: rgba(255, 140, 0, 0.4);
  }
  
  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 2;
  }
  
  .nav-logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--text-primary);
    text-decoration: none;
    transition: var(--transition-base);
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .nav-logo:hover {
    transform: scale(1.05);
    filter: drop-shadow(0 0 8px rgba(255, 140, 0, 0.5));
  }
  
  .nav-links {
    display: flex;
    gap: 2rem;
    align-items: center;
  }
  
  .nav-links a {
    color: var(--text-secondary);
    text-decoration: none;
    transition: var(--transition-base);
    position: relative;
  }
  
  .nav-links a:hover {
    color: var(--primary-color);
    text-shadow: 0 0 8px rgba(255, 140, 0, 0.3);
  }
  
  .nav-cta {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: white !important;
    padding: 0.5rem 1.5rem;
    border-radius: 25px;
    transition: var(--transition-base);
    box-shadow: 0 4px 15px rgba(255, 109, 90, 0.3);
  }
  
  .nav-cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 109, 90, 0.4);
    color: white !important;
  }
  
  /* 頁面標題 */
  .page-header {
    text-align: center;
    padding: 3rem 0;
    margin-bottom: 2rem;
  }
  
  .page-header h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 0 20px rgba(255, 140, 0, 0.3));
  }
  
  .page-header p {
    font-size: 1.25rem;
    color: var(--text-secondary);
  }
  
  /* 主要內容容器 */
  .service-container {
    max-width: 1400px; /* 增加寬度讓卡片更寬 */
    margin: 0 auto;
    padding: 0 2rem;
  }
  
  /* Section 通用樣式 */
  section {
    padding: 3rem 0;
  }
  
  .section-header {
    text-align: center;
    margin-bottom: 3rem;
  }
  
  .section-header h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 0 15px rgba(255, 140, 0, 0.2));
  }
  
  .section-header p {
    font-size: 1.125rem;
    color: var(--text-secondary);
  }
  
  /* 服務卡片 */
  .services-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr); /* 大螢幕：四個一列 */
    gap: 1.5rem; /* 減少間距 */
    margin-bottom: 4rem;
  }
  
  .service-card {
    padding: 2.5rem;
    position: relative;
    opacity: 0;
    transform: translateY(30px);
  }
  
  .service-card.animate-in {
    opacity: 1;
    transform: translateY(0);
    transition: all 0.6s ease;
  }
  
  .service-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    transform: scaleX(0);
    transition: var(--transition-base);
    z-index: 2;
  }
  
  .service-card:hover::before {
    transform: scaleX(1);
  }
  
  .service-icon {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
    transition: var(--transition-base);
    box-shadow: 0 8px 20px rgba(255, 109, 90, 0.3);
    position: relative;
    z-index: 2;
  }
  
  .service-card:hover .service-icon {
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 12px 30px rgba(255, 109, 90, 0.4);
  }
  
  .service-icon svg {
    width: 30px;
    height: 30px;
    stroke: white;
    fill: none;
  }
  
  .service-icon svg circle[fill="currentColor"] {
    fill: white;
  }
  
  .service-card h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    position: relative;
    z-index: 2;
    color: var(--text-primary);
  }
  
  .service-card p {
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
    line-height: 1.8;
    position: relative;
    z-index: 2;
  }
  
  .service-features {
    list-style: none;
    margin-bottom: 2rem;
    position: relative;
    z-index: 2;
  }
  
  .service-features li {
    padding: 0.5rem 0;
    padding-left: 1.5rem;
    position: relative;
    color: var(--text-secondary);
  }
  
  .service-features li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: var(--primary-color);
    font-weight: bold;
    text-shadow: 0 0 5px rgba(255, 140, 0, 0.5);
  }
  
  /* 表單容器 - 移除所有動效 */
  .form-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 3rem;
    position: relative;
    overflow: hidden;
    background: rgba(255, 109, 90, 0.06);
    backdrop-filter: blur(30px) saturate(180%);
    -webkit-backdrop-filter: blur(30px) saturate(180%);
    border: 1px solid rgba(255, 140, 0, 0.3);
    border-radius: 30px;
    box-shadow: 
      0 20px 60px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.15),
      inset 0 -1px 0 rgba(255, 255, 255, 0.08);
  }
  
  /* 移除表單容器的 hover 效果 */
  
  .form-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.08) 0%,
      rgba(255, 255, 255, 0.04) 50%,
      rgba(255, 255, 255, 0.01) 100%);
    pointer-events: none;
    z-index: 1;
  }
  
  /* 進度條 */
  .form-progress {
    margin-bottom: 3rem;
  }
  
  .progress-bar {
    height: 4px;
    background: var(--border-color);
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 2rem;
    position: relative;
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
    width: 25%;
    transition: width 0.5s ease;
    position: relative;
    border-radius: 2px;
    box-shadow: 0 0 10px rgba(255, 140, 0, 0.5);
  }
  
  .progress-fill::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: shimmer 2s infinite;
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  .step-indicators {
    display: flex;
    justify-content: space-between;
    max-width: 300px;
    margin: 0 auto;
  }
  
  .step-indicator {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--bg-hover);
    border: 2px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    transition: var(--transition-base);
    backdrop-filter: var(--backdrop-blur);
  }
  
  .step-indicator.active {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    border-color: var(--primary-color);
    transform: scale(1.1);
    box-shadow: 0 0 20px rgba(255, 140, 0, 0.5);
  }
  
  /* 表單步驟 */
  .form-step {
    display: none;
    opacity: 0;
    transform: translateY(20px);
    transition: var(--transition-base);
    min-height: 480px; /* 設定最小高度確保等高 */
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  
  .form-step.active {
    display: flex;
  }
  
  /* 表單內容區域 */
  .form-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .form-step h3 {
    font-size: 1.75rem;
    margin-bottom: 2rem;
    text-align: center;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    flex-shrink: 0; /* 避免標題被壓縮 */
  }
  
  /* 服務選項 - 移除移動和旋轉效果 */
  .service-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .service-option {
    padding: 2rem 1rem;
    text-align: center;
    cursor: pointer;
    transition: var(--transition-base);
    border: 2px solid var(--border-color);
  }
  
  .service-option:hover {
    border-color: var(--primary-color);
    /* 移除 transform: translateY(-5px) */
    box-shadow: 0 10px 30px rgba(255, 109, 90, 0.2);
  }
  
  .service-option.selected {
    background: rgba(255, 109, 90, 0.15);
    border-color: var(--primary-color);
    box-shadow: 0 0 30px rgba(255, 140, 0, 0.3);
  }
  
  .option-icon {
    width: 60px;
    height: 60px;
    margin: 0 auto 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    border-radius: 15px;
    transition: var(--transition-base);
    position: relative;
    z-index: 2;
  }
  
  .service-option:hover .option-icon {
    /* 移除 rotate(5deg)，只保留縮放 */
    transform: scale(1.1);
    box-shadow: 0 0 20px rgba(255, 140, 0, 0.5);
  }
  
  .option-icon svg {
    width: 30px;
    height: 30px;
    stroke: white;
    transition: var(--transition-base);
  }
  
  .service-option h4 {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    position: relative;
    z-index: 2;
  }
  
  .service-option p {
    font-size: 0.9rem;
    color: var(--text-secondary);
    position: relative;
    z-index: 2;
  }
  
  /* 表單群組 */
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--text-primary);
  }
  
  .form-group input,
  .form-group select,
  .form-group textarea {
    width: 100%;
    padding: 1rem;
    background: var(--bg-hover);
    border: 1px solid var(--border-color);
    border-radius: 10px;
    color: var(--text-primary);
    font-size: 1rem;
    transition: var(--transition-base);
    backdrop-filter: var(--backdrop-blur);
  }
  
  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(255, 109, 90, 0.1), 0 0 20px rgba(255, 140, 0, 0.2);
    background: rgba(255, 109, 90, 0.05);
  }
  
  .form-group input.error,
  .form-group select.error,
  .form-group textarea.error {
    border-color: var(--error-color);
    box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1);
  }
  
  .form-group input::placeholder,
  .form-group textarea::placeholder {
    color: var(--text-tertiary);
  }
  
  /* 欄位錯誤訊息 */
  .field-error-message {
    color: var(--error-color);
    font-size: 0.875rem;
    margin-top: 0.5rem;
    display: flex;
    align-items: center;
    animation: fadeIn 0.3s ease;
  }
  
  .field-error-message::before {
    content: '⚠';
    margin-right: 0.5rem;
    font-size: 1rem;
  }
  
  /* 預算滑桿 */
  .budget-group {
    transition: var(--transition-base);
  }
  
  .budget-slider {
    margin-top: 1.5rem;
  }
  
  .budget-track {
    position: relative;
    padding: 20px 0;
  }
  
  #budget-range {
    width: 100%;
    height: 8px;
    background: var(--border-color);
    border-radius: 4px;
    outline: none;
    -webkit-appearance: none;
    appearance: none;
    cursor: pointer;
    transition: var(--transition-base);
  }
  
  #budget-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 24px;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    border-radius: 50%;
    cursor: pointer;
    transition: var(--transition-base);
    box-shadow: 0 2px 8px rgba(255, 109, 90, 0.3), 0 0 0 3px rgba(255, 140, 0, 0.1);
    border: 3px solid white;
    position: relative;
    z-index: 2;
  }
  
  #budget-range::-moz-range-thumb {
    width: 24px;
    height: 24px;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    border-radius: 50%;
    cursor: pointer;
    transition: var(--transition-base);
    box-shadow: 0 2px 8px rgba(255, 109, 90, 0.3), 0 0 0 3px rgba(255, 140, 0, 0.1);
    border: 3px solid white;
    position: relative;
    z-index: 2;
  }
  
  #budget-range::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 0 20px rgba(255, 140, 0, 0.6), 0 0 0 6px rgba(255, 140, 0, 0.1);
  }
  
  #budget-range::-moz-range-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 0 20px rgba(255, 140, 0, 0.6), 0 0 0 6px rgba(255, 140, 0, 0.1);
  }
  
  .budget-markers {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    display: flex;
    justify-content: space-between;
    pointer-events: none;
  }
  
  .budget-markers span {
    width: 2px;
    height: 12px;
    background: var(--border-color);
    display: block;
    position: relative;
  }
  
  .budget-markers span::after {
    content: '';
    position: absolute;
    top: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 6px;
    height: 6px;
    background: var(--bg-hover);
    border-radius: 50%;
    border: 1px solid var(--border-color);
  }
  
  .budget-display {
    text-align: center;
    margin-top: 1.5rem;
    font-size: 1.25rem;
    color: var(--primary-color);
    font-weight: 600;
    padding: 12px 24px;
    background: rgba(255, 109, 90, 0.1);
    border-radius: 30px;
    display: inline-block;
    margin-left: 50%;
    transform: translateX(-50%);
    border: 1px solid rgba(255, 109, 90, 0.3);
    transition: var(--transition-base);
    backdrop-filter: var(--backdrop-blur);
    text-shadow: 0 0 10px rgba(255, 140, 0, 0.3);
  }
  
  .budget-hint {
    text-align: center;
    margin-top: 1rem;
    font-size: 0.875rem;
    color: var(--text-secondary);
    opacity: 0.8;
  }
  
  /* 核取方塊 */
  .checkbox-group label {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  
  .checkbox-group input[type="checkbox"] {
    width: auto;
    margin-right: 0.5rem;
    accent-color: var(--primary-color);
  }
  
  /* 表單導航 */
  .form-navigation {
    display: flex;
    justify-content: space-between;
    margin-top: auto; /* 推到底部 */
    gap: 1rem;
    flex-shrink: 0; /* 避免導航被壓縮 */
  }
  
  .form-navigation .btn:only-child {
    margin-left: auto;
  }
  
  /* 按鈕樣式 */
  .btn {
    padding: 0.875rem 2rem;
    border-radius: 30px;
    text-decoration: none;
    font-weight: 500;
    transition: var(--transition-base);
    display: inline-block;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    backdrop-filter: var(--backdrop-blur);
    position: relative;
    overflow: hidden;
  }
  
  .btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }
  
  .btn:hover::before {
    left: 100%;
  }
  
  .btn-primary {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: white;
    box-shadow: 0 4px 15px rgba(255, 109, 90, 0.3);
  }
  
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 109, 90, 0.4);
  }
  
  .btn-secondary {
    background: var(--glass-bg);
    color: var(--text-secondary);
    border: 2px solid var(--border-color);
  }
  
  .btn-secondary:hover {
    border-color: var(--primary-color);
    color: var(--text-primary);
    background: rgba(255, 109, 90, 0.1);
  }
  
  /* 載入動畫 */
  .loading-spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 0.8s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  /* 成功訊息 - 移除液體效果 */
  .success-message {
    text-align: center;
    padding: 3rem;
    animation: fadeIn 0.5s ease;
    /* 保持背景但移除液體效果 */
    background: rgba(255, 109, 90, 0.06);
    backdrop-filter: blur(30px) saturate(180%);
    -webkit-backdrop-filter: blur(30px) saturate(180%);
    border: 1px solid rgba(255, 140, 0, 0.3);
    border-radius: 30px;
    box-shadow: 
      0 20px 60px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.15),
      inset 0 -1px 0 rgba(255, 255, 255, 0.08);
  }
  
  /* 覆蓋成功訊息的 hover 效果 */
  .success-message:hover {
    transform: none !important;
    box-shadow: 
      0 20px 60px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.15),
      inset 0 -1px 0 rgba(255, 255, 255, 0.08) !important;
    border-color: rgba(255, 140, 0, 0.3) !important;
    background: rgba(255, 109, 90, 0.06) !important;
  }
  
  /* 確保成功訊息內的 liquid-glow 不會顯示 */
  .success-message .liquid-glow {
    opacity: 0 !important;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .success-animation {
    position: relative;
    width: 120px;
    height: 120px;
    margin: 0 auto 2rem;
  }
  
  .success-icon {
    width: 100px;
    height: 100px;
    background: linear-gradient(135deg, var(--success-color), #66bb6a);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: scaleIn 0.5s ease 0.2s both;
    box-shadow: 0 8px 24px rgba(76, 175, 80, 0.3), 0 0 40px rgba(255, 140, 0, 0.2);
  }
  
  .success-icon svg {
    width: 60px;
    height: 60px;
    color: white;
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
    animation: checkmark 0.8s ease 0.5s forwards;
  }
  
  @keyframes checkmark {
    to {
      stroke-dashoffset: 0;
    }
  }
  
  .success-ripple {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    transform: translate(-50%, -50%);
    opacity: 0.3;
    animation: ripple 2s ease 0.8s infinite;
  }
  
  @keyframes ripple {
    0% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.3;
    }
    100% {
      transform: translate(-50%, -50%) scale(1.5);
      opacity: 0;
    }
  }
  
  @keyframes scaleIn {
    from {
      transform: translate(-50%, -50%) scale(0);
    }
    to {
      transform: translate(-50%, -50%) scale(1);
    }
  }
  
  .success-message h3 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 0 10px rgba(255, 140, 0, 0.3));
  }
  
  .success-subtitle {
    font-size: 1.125rem;
    color: var(--text-secondary);
    margin-bottom: 2rem;
  }
  
  /* 聯絡資訊卡片 */
  .contact-info-card {
    padding: 1.5rem;
    margin: 2rem auto;
    max-width: 500px;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    transition: var(--transition-base);
  }
  
  .contact-info-card:hover {
    border-color: var(--primary-color);
    box-shadow: 0 4px 12px rgba(255, 109, 90, 0.1);
  }
  
  .info-icon {
    width: 48px;
    height: 48px;
    background: rgba(255, 109, 90, 0.1);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    position: relative;
    z-index: 2;
  }
  
  .info-icon svg {
    width: 24px;
    height: 24px;
    stroke: var(--primary-color);
  }
  
  .info-content {
    text-align: left;
    position: relative;
    z-index: 2;
  }
  
  .info-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin-bottom: 0.25rem;
  }
  
  .info-value {
    font-size: 1rem;
    color: var(--text-primary);
    font-weight: 500;
    margin: 0;
  }
  
  .success-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 2rem;
  }
  
  /* 提交摘要 */
  .submission-summary {
    background: var(--glass-bg);
    border-radius: 12px;
    padding: 1.5rem;
    margin: 2rem 0;
    text-align: left;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    backdrop-filter: var(--backdrop-blur);
    border: 1px solid var(--glass-border);
  }
  
  .submission-summary h4 {
    margin-bottom: 1rem;
    color: var(--primary-color);
    font-size: 1.1rem;
    text-shadow: 0 0 10px rgba(255, 140, 0, 0.3);
  }
  
  .summary-items {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .summary-item {
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--border-color);
    font-size: 0.95rem;
  }
  
  .summary-item:last-child {
    border-bottom: none;
  }
  
  .summary-item strong {
    color: var(--text-primary);
    margin-right: 0.5rem;
  }
  
  /* 錯誤提示 */
  .error-toast {
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--error-color);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
    opacity: 0;
    transform: translateY(-20px);
    transition: var(--transition-base);
    z-index: 1001;
    max-width: 300px;
    backdrop-filter: var(--backdrop-blur);
  }
  
  .error-toast.show {
    opacity: 1;
    transform: translateY(0);
  }
  
  /* Footer */
  .service-footer {
    text-align: center;
    padding: 2rem;
    color: var(--text-secondary);
    border-top: 1px solid var(--border-color);
    margin-top: 4rem;
    background: var(--glass-bg);
    backdrop-filter: var(--backdrop-blur);
  }
  
  /* 響應式設計 */
  /* 性能優化：在小螢幕上降低動畫複雜度 */
  @media (max-width: 768px) {
    .automation-background {
      opacity: 0.2;
    }
  }
  
  /* 減少動態效果以節省電池（偏好設定） */
  @media (prefers-reduced-motion: reduce) {
    .automation-background {
      display: none;
    }
  }
  
  /* 中型螢幕優化（平板） */
  @media (max-width: 1024px) and (min-width: 769px) {
    .services-grid {
      grid-template-columns: repeat(2, 1fr); /* 平板：兩個一列 */
      gap: 1.25rem; /* 調整平板間距 */
    }
  }
  
  @media (max-width: 768px) {
    .nav-links a:not(.nav-cta) {
      display: none;
    }
    
    .page-header h1 {
      font-size: 2rem;
    }
    
    .services-grid {
      grid-template-columns: repeat(2, 1fr); /* 中等螢幕：兩個一列 */
      gap: 1.25rem; /* 調整中等螢幕間距 */
    }
    
    .form-container {
      padding: 2rem;
    }
    
    .service-options {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .section-header h2 {
      font-size: 2rem;
    }
  }
  
  @media (max-width: 480px) {
    .nav-container {
      padding: 0 1rem;
    }
    
    .service-container {
      padding: 0 1rem;
    }
    
    .form-container {
      padding: 1.5rem;
      border-radius: 20px;
    }
    
    .services-grid {
      grid-template-columns: 1fr; /* 手機版：一個一列 */
      gap: 1rem; /* 手機版間距 */
    }
    
    .service-options {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .form-navigation {
      flex-direction: column;
    }
    
    .form-navigation .btn {
      width: 100%;
    }
    
    .service-card {
      padding: 2rem;
    }
    
    .success-actions {
      flex-direction: column;
    }
    
    .success-actions .btn {
      width: 100%;
    }
  }
</style>
</body>
</html>