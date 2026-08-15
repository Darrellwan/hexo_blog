/* n8n-style brand icon library + authentic node renderer.
   Exposes: window.N8NIcons (id -> {svg, bg}), window.renderN8NNode(opts) -> svg string, window.renderN8NFlow(opts) */

(function () {
  // Each icon: 24x24 viewBox, designed to sit inside n8n's rounded-square tile.
  const I = {
    googleSheets: {
      bg: '#0f9d58',
      svg: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#fff"/><path d="M14 2v6h6" fill="none" stroke="#0f9d58" stroke-width="1"/><path d="M8 12h10v1.5H8zM8 15h10v1.5H8zM8 18h10v1.5H8zM10 11h1v9h-1zM14 11h1v9h-1z" fill="#0f9d58"/>`
    },
    gmail: {
      bg: '#ea4335',
      svg: `<path d="M3 6l9 6 9-6v12a1 1 0 0 1-1 1h-3V11l-5 3.5L7 11v8H4a1 1 0 0 1-1-1z" fill="#fff"/><path d="M3 6l9 6 9-6-1.5-1L12 10.5 4.5 5z" fill="#c5221f"/>`
    },
    slack: {
      bg: '#4a154b',
      svg: `<path d="M6 15a2 2 0 1 1-2-2h2zM7 15a2 2 0 0 1 4 0v5a2 2 0 0 1-4 0z" fill="#e01e5a"/><path d="M9 6a2 2 0 1 1 2-2v2zM9 7a2 2 0 0 1 0 4H4a2 2 0 0 1 0-4z" fill="#36c5f0"/><path d="M18 9a2 2 0 1 1 2 2h-2zM17 9a2 2 0 0 1-4 0V4a2 2 0 0 1 4 0z" fill="#2eb67d"/><path d="M15 18a2 2 0 1 1-2 2v-2zM15 17a2 2 0 0 1 0-4h5a2 2 0 0 1 0 4z" fill="#ecb22e"/>`
    },
    webhook: {
      bg: '#c02aa5',
      svg: `<path d="M8 10.5a4 4 0 1 1 6 3.5l2 3.5a2 2 0 1 1-1.7 1l-2-3.5a4 4 0 0 1-4.3-4.5zm12 3a2 2 0 1 1-1.3 3.5H15a4 4 0 0 1-7.5-1l1.7-1a2 2 0 1 0 3.8-1h5a2 2 0 0 1 2-.5zM9 6a4 4 0 0 1 7.5 1l-1.7 1a2 2 0 1 0-3.8 1L7.5 14.5A2 2 0 1 1 6 13l2.5-4.3A4 4 0 0 1 9 6z" fill="#fff"/>`
    },
    switch: {
      bg: '#506bdb',
      svg: `<circle cx="6" cy="6" r="2.5" fill="#fff"/><circle cx="6" cy="18" r="2.5" fill="#fff"/><circle cx="18" cy="12" r="2.5" fill="#fff"/><path d="M8.5 6 h4 a2 2 0 0 1 2 2 v2 M8.5 18 h4 a2 2 0 0 0 2 -2 v-2" fill="none" stroke="#fff" stroke-width="1.2"/>`
    },
    code: {
      bg: '#ff6d5a',
      svg: `<path d="M9 8l-4 4 4 4M15 8l4 4-4 4M13 6l-2 12" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>`
    },
    schedule: {
      bg: '#3fb95b',
      svg: `<circle cx="12" cy="12" r="8" fill="none" stroke="#fff" stroke-width="1.6"/><path d="M12 7v5l3 2" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>`
    },
    http: {
      bg: '#1f6feb',
      svg: `<circle cx="12" cy="12" r="8" fill="none" stroke="#fff" stroke-width="1.4"/><ellipse cx="12" cy="12" rx="4" ry="8" fill="none" stroke="#fff" stroke-width="1.4"/><path d="M4 12h16" stroke="#fff" stroke-width="1.4"/>`
    },
    agent: {
      bg: '#8e6fff',
      svg: `<rect x="5" y="6" width="14" height="12" rx="3" fill="none" stroke="#fff" stroke-width="1.5"/><circle cx="9" cy="12" r="1.4" fill="#fff"/><circle cx="15" cy="12" r="1.4" fill="#fff"/><path d="M10 16h4M12 3v3M6 10h-1M19 10h-1" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>`
    },
    line: {
      bg: '#06c755',
      svg: `<path d="M12 3.5c-5 0-9 3.2-9 7.2 0 3.6 3 6.6 7.2 7.1.3.1.7.2.8.5.1.2 0 .6 0 .9l-.1.8c0 .3-.2 1 .9.5s5.8-3.4 7.9-5.8c1.4-1.5 2.2-3.2 2.2-5C21 6.7 17 3.5 12 3.5z" fill="#fff"/><path d="M8.6 9.2v3.6h1.8M11.3 9.2v3.6l-1.3-1.8M12.8 9.2h1.6v.4h-1M13 11h1.4M16 9.2h1.8v.4h-1v2.8" fill="none" stroke="#06c755" stroke-width="0.6" stroke-linejoin="round"/>`
    },
    sheets: { // alias
      bg: '#0f9d58',
      svg: `<rect x="5" y="3" width="14" height="18" rx="1" fill="#fff"/><path d="M8 8h8M8 11h8M8 14h8M8 17h8M11 7v11M15 7v11" stroke="#0f9d58" stroke-width="1"/>`
    },
    telegram: {
      bg: '#2aabee',
      svg: `<path d="M4 11l16-7-3 16-5-4-3 3v-4l9-8-11 7z" fill="#fff"/>`
    },
    drive: {
      bg: '#ffba00',
      svg: `<path d="M8 4l-6 11 3 5h6l-3-5 6-11z" fill="#0cb15a"/><path d="M16 4l6 11h-6L10 4z" fill="#ffba00"/><path d="M8 15h14l-3 5H5z" fill="#2684fc"/>`
    },
    merge: {
      bg: '#ff9400',
      svg: `<path d="M5 7l4 4v2a2 2 0 0 0 2 2h8M5 17l4-4" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="19" cy="13" r="1.5" fill="#fff"/>`
    },
    split: {
      bg: '#ff9400',
      svg: `<circle cx="5" cy="12" r="1.5" fill="#fff"/><path d="M6.5 12h3l4-5h5M9.5 12h3l4 5h5" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>`
    },
    filter: {
      bg: '#5a9cff',
      svg: `<path d="M4 5h16l-6 8v6l-4-2v-4z" fill="#fff"/>`
    },
    sort: {
      bg: '#b366ff',
      svg: `<path d="M8 5v14M6 17l2 2 2-2M16 19V5M14 7l2-2 2 2" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`
    },
    edit: {
      bg: '#00b8a9',
      svg: `<path d="M4 20h4L18 10l-4-4L4 16z" fill="none" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/><path d="M14 6l4 4" stroke="#fff" stroke-width="1.6"/>`
    },
    aggregate: {
      bg: '#b57a4e',
      svg: `<path d="M5 5h4v4H5zM5 15h4v4H5zM15 10h4v4h-4zM9 7h6l-2 3M9 17h6l-2-3" fill="#fff"/>`
    },
    parser: {
      bg: '#6b7280',
      svg: `<path d="M9 8l-4 4 4 4M15 8l4 4-4 4" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>`
    },
    memory: {
      bg: '#8e6fff',
      svg: `<rect x="5" y="8" width="14" height="8" rx="1" fill="#fff"/><path d="M7 5v3M11 5v3M13 5v3M17 5v3M7 16v3M11 16v3M13 16v3M17 16v3" stroke="#fff" stroke-width="1.4"/>`
    },
  };

  window.N8NIcons = I;

  // Render a single n8n-style node tile (with label below, like reference).
  // opts: {x, y, icon, label, sub, active, size}
  window.renderN8NNode = function (o) {
    const s = o.size || 56;
    const icon = I[o.icon] || I.code;
    const active = o.active ? 1 : 0;
    const label = (o.label || '').replace(/&/g,'&amp;');
    const sub = o.sub ? `<text x="${o.x + s/2}" y="${o.y + s + 26}" font-family="JetBrains Mono, monospace" font-size="7" fill="#8e8a80" text-anchor="middle">${o.sub}</text>` : '';
    // Inner icon tile is ~60% of node, centered
    const iconSize = Math.round(s * 0.55);
    const iconPad = (s - iconSize) / 2;
    // scale 24x24 icon viewBox to iconSize
    const scale = iconSize / 24;
    return `
      <g class="n-node ${active?'n-active':''}">
        <rect x="${o.x}" y="${o.y}" width="${s}" height="${s}" rx="10" class="n-tile"/>
        ${active ? `<rect x="${o.x-1.5}" y="${o.y-1.5}" width="${s+3}" height="${s+3}" rx="11.5" class="n-ring"/>` : ''}
        <g transform="translate(${o.x + iconPad} ${o.y + iconPad})">
          <rect width="${iconSize}" height="${iconSize}" rx="${iconSize*0.2}" fill="${icon.bg}"/>
          <g transform="scale(${scale})">${icon.svg}</g>
        </g>
        <text x="${o.x + s/2}" y="${o.y + s + 12}" font-family="Geist, Inter, sans-serif" font-size="8.5" font-weight="500" fill="#f4f2ed" text-anchor="middle">${label}</text>
        ${sub}
      </g>`;
  };

  // Render a straight/orthogonal wire between two nodes with optional particle.
  // opts: {x1, y1, x2, y2, dashed, particle, delay, dur, color}
  window.renderN8NWire = function (o) {
    const midX = (o.x1 + o.x2) / 2;
    const d = o.vertical
      ? `M${o.x1},${o.y1} L${o.x1},${(o.y1+o.y2)/2} L${o.x2},${(o.y1+o.y2)/2} L${o.x2},${o.y2}`
      : `M${o.x1},${o.y1} L${midX},${o.y1} L${midX},${o.y2} L${o.x2},${o.y2}`;
    const stroke = o.dashed ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.22)';
    const dash = o.dashed ? ' stroke-dasharray="3 3"' : '';
    let out = `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="1.2"${dash}/>`;
    if (o.particle !== false) {
      out += `<circle r="2.6" fill="${o.color || '#d99a66'}"><animateMotion dur="${o.dur || 2.8}s" begin="${o.delay || 0}s" repeatCount="indefinite" path="${d}"/></circle>`;
    }
    return out;
  };

  // Render a tiny "+" insertion affordance between two nodes
  window.renderN8NPlus = function (x, y) {
    return `<g class="n-plus"><circle cx="${x}" cy="${y}" r="6" fill="#17191d" stroke="rgba(255,255,255,0.2)"/><path d="M${x-3},${y} h6 M${x},${y-3} v6" stroke="rgba(255,255,255,0.6)" stroke-width="1"/></g>`;
  };
})();
