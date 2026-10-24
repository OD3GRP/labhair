// The cast: placeholder characters drawn as SVG in bold-outline comic style, each with 11 expressions.
// Real art replaces them automatically: list a file in art/index.json (made by tools/check-art.mjs) and
// castEl() shows art/cast/<id>/<expression>.webp instead of the placeholder.
(function(){
  const NS = 'http://www.w3.org/2000/svg', INK = '#15202B';
  const EXPRESSIONS = ['neutral', 'talking', 'happy', 'laughing', 'surprised', 'confused', 'thinking', 'shrug', 'wave', 'embarrassed', 'listening'];

  // People: skin, hair colour and style, clothes, extras. Animals: kind and colours.
  const CAST = {
    grainne: {name:'Gráinne', type:'person', skin:'#F1C6A6', hair:'#4A2C1D', style:'long', clothes:'#2E6A4F', extras:['freckles', 'earrings']},
    nora:    {name:'Nóra', type:'person', skin:'#EBC3A4', hair:'#B9BCBF', style:'curly', clothes:'#1F3B5C', extras:['glasses']},
    maire:   {name:'Máire', type:'person', skin:'#F6D2B8', hair:'#B4492A', style:'plait', clothes:'#E2AE2F', extras:['freckles']},
    ella:    {name:'Ella', type:'person', skin:'#F3CDB2', hair:'#E3C46B', style:'bob', clothes:'#E2AE2F', extras:['badge']},
    donall:  {name:'Dónall', type:'person', skin:'#E9B996', hair:'#E8E8E8', style:'cap', clothes:'#7A6A4F', extras:['beard']},
    seoirse: {name:'Seoirse', type:'person', skin:'#D9A47E', hair:'#2B2420', style:'short', clothes:'#1E7A3C', extras:['whistle']},
    padraig: {name:'Pádraig', type:'person', skin:'#D9A47E', hair:'#3A3A3A', style:'beanie', clothes:'#E06A1B', extras:['stubble']},
    brid:    {name:'Bríd', type:'person', skin:'#C98E6A', hair:'#2A1C16', style:'bun', clothes:'#F2EDE4', extras:['apron']},
    colm:    {name:'Colm', type:'person', skin:'#E5B08E', hair:'#9A9A9A', style:'short', clothes:'#3D4A2F', extras:['stubble']},
    danny:   {name:'Danny', type:'person', skin:'#8D5B3E', hair:'#1C1410', style:'curly', clothes:'#5B4B8A', extras:['headphones']},
    fianait: {name:'Fianait', type:'person', skin:'#F0C8A8', hair:'#151515', style:'short', clothes:'#E8EEF2', extras:['tie']},
    puifin:  {name:'Puifín', type:'puffin'},
    giorria: {name:'Giorria', type:'hare'},
    'madra-rua': {name:'Madra Rua', type:'fox'},
    broc:    {name:'Broc', type:'badger'},
    spideog: {name:'An Spideog', type:'robin'}
  };

  const FACE = {
    neutral:     {eyes:'open', mouth:'small', brows:'flat'},
    talking:     {eyes:'open', mouth:'open', brows:'up'},
    happy:       {eyes:'open', mouth:'smile', brows:'up'},
    laughing:    {eyes:'closed', mouth:'laugh', brows:'up'},
    surprised:   {eyes:'wide', mouth:'o', brows:'high'},
    confused:    {eyes:'open', mouth:'wobble', brows:'tilt'},
    thinking:    {eyes:'up', mouth:'flat', brows:'tilt', extra:'finger'},
    shrug:       {eyes:'open', mouth:'small', brows:'up', extra:'shrug'},
    wave:        {eyes:'open', mouth:'smile', brows:'up', extra:'wave'},
    embarrassed: {eyes:'closed', mouth:'grin', brows:'up', extra:'sweat'},
    listening:   {eyes:'open', mouth:'small', brows:'flat', tilt:-6}
  };

  // Face parts, centred on (cx, cy) with eye spacing dx; s scales them.
  function face(f, cx, cy, dx, s, eyeFill){
    const e = [], k = s;
    const eye = x => {
      if (f.eyes === 'closed') return `<path d="M${x - 7 * k} ${cy + 2 * k} Q${x} ${cy - 6 * k} ${x + 7 * k} ${cy + 2 * k}" fill="none" stroke="${INK}" stroke-width="${3.5 * k}" stroke-linecap="round"/>`;
      const r = f.eyes === 'wide' ? 7.5 * k : 6 * k, py = f.eyes === 'up' ? -3 * k : 0;
      return `<ellipse cx="${x}" cy="${cy}" rx="${r}" ry="${r * 1.15}" fill="#fff" stroke="${INK}" stroke-width="${2.5 * k}"/><circle cx="${x + 1 * k}" cy="${cy + py + 1 * k}" r="${3.4 * k}" fill="${eyeFill || INK}"/><circle cx="${x + 2.2 * k}" cy="${cy + py - 0.5 * k}" r="${1.1 * k}" fill="#fff"/>`;
    };
    e.push(eye(cx - dx), eye(cx + dx));
    const by = cy - 13 * k, lift = f.brows === 'high' ? -5 * k : f.brows === 'up' ? -2 * k : 0;
    const brow = (x, side) => {
      const tilt = f.brows === 'tilt' ? (side < 0 ? 4 * k : -3 * k) : 0;
      return `<path d="M${x - 7 * k} ${by + lift + tilt} Q${x} ${by + lift - 4 * k} ${x + 7 * k} ${by + lift - tilt}" fill="none" stroke="${INK}" stroke-width="${3.5 * k}" stroke-linecap="round"/>`;
    };
    e.push(brow(cx - dx, -1), brow(cx + dx, 1));
    const my = cy + 24 * k, w = 11 * k;
    const mouths = {
      small:  `<path d="M${cx - w * .7} ${my} Q${cx} ${my + 6 * k} ${cx + w * .7} ${my}" fill="none" stroke="${INK}" stroke-width="${3.5 * k}" stroke-linecap="round"/>`,
      smile:  `<path d="M${cx - w} ${my - 2 * k} Q${cx} ${my + 12 * k} ${cx + w} ${my - 2 * k}" fill="none" stroke="${INK}" stroke-width="${3.5 * k}" stroke-linecap="round"/>`,
      open:   `<path d="M${cx - w * .75} ${my - 2 * k} Q${cx} ${my + 14 * k} ${cx + w * .75} ${my - 2 * k} Z" fill="#7A2A2A" stroke="${INK}" stroke-width="${3 * k}" stroke-linejoin="round"/>`,
      laugh:  `<path d="M${cx - w} ${my - 4 * k} Q${cx} ${my + 18 * k} ${cx + w} ${my - 4 * k} Z" fill="#7A2A2A" stroke="${INK}" stroke-width="${3 * k}" stroke-linejoin="round"/><path d="M${cx - w * .6} ${my - 2 * k} L${cx + w * .6} ${my - 2 * k}" stroke="#fff" stroke-width="${3 * k}"/>`,
      o:      `<ellipse cx="${cx}" cy="${my + 2 * k}" rx="${5 * k}" ry="${6.5 * k}" fill="#7A2A2A" stroke="${INK}" stroke-width="${3 * k}"/>`,
      flat:   `<path d="M${cx - w * .6} ${my + 2 * k} L${cx + w * .6} ${my + 2 * k}" stroke="${INK}" stroke-width="${3.5 * k}" stroke-linecap="round"/>`,
      wobble: `<path d="M${cx - w * .7} ${my + 3 * k} Q${cx - w * .3} ${my - 1 * k} ${cx} ${my + 3 * k} T${cx + w * .7} ${my + 2 * k}" fill="none" stroke="${INK}" stroke-width="${3.5 * k}" stroke-linecap="round"/>`,
      grin:   `<path d="M${cx - w} ${my - 2 * k} Q${cx} ${my + 12 * k} ${cx + w} ${my - 2 * k} Z" fill="#fff" stroke="${INK}" stroke-width="${3 * k}" stroke-linejoin="round"/>`
    };
    e.push(mouths[f.mouth] || mouths.small);
    return e.join('');
  }
  function extras(f, cx, cy, color){
    if (f.extra === 'sweat') return `<path d="M${cx + 46} ${cy - 30} q6 10 0 14 q-6 -4 0 -14z" fill="#8FD3FF" stroke="${INK}" stroke-width="2.5"/>`;
    if (f.extra === 'wave') return `<g class="cast-wave"><path d="M160 150 L178 92" stroke="${INK}" stroke-width="17" stroke-linecap="round"/><path d="M160 150 L178 92" stroke="${color}" stroke-width="11" stroke-linecap="round"/><circle cx="180" cy="84" r="11" fill="#F1C6A6" stroke="${INK}" stroke-width="3.5"/></g>`;
    if (f.extra === 'shrug') return `<g><circle cx="30" cy="150" r="11" fill="#F1C6A6" stroke="${INK}" stroke-width="3.5"/><circle cx="170" cy="150" r="11" fill="#F1C6A6" stroke="${INK}" stroke-width="3.5"/></g>`;
    if (f.extra === 'finger') return `<g><circle cx="${cx + 4}" cy="${cy + 44}" r="9" fill="#F1C6A6" stroke="${INK}" stroke-width="3.5"/></g>`;
    return '';
  }

  function personSVG(c, f){
    const cx = 100, cy = 88, sk = c.skin, hc = c.hair;
    const back = {
      long:  `<path d="M52 80 Q50 30 100 30 Q150 30 148 80 L156 150 Q100 160 44 150 Z" fill="${hc}" stroke="${INK}" stroke-width="4"/>`,
      plait: `<path d="M56 80 Q54 32 100 32 Q146 32 144 80 L146 110 Q100 118 54 110 Z" fill="${hc}" stroke="${INK}" stroke-width="4"/><path d="M140 100 q14 16 6 30 q10 14 0 28 q8 12 -2 22" fill="none" stroke="${hc}" stroke-width="14" stroke-linecap="round"/><path d="M140 100 q14 16 6 30 q10 14 0 28 q8 12 -2 22" fill="none" stroke="${INK}" stroke-width="3" stroke-dasharray="6 8"/>`,
      bob:   `<path d="M54 82 Q52 32 100 32 Q148 32 146 82 L148 122 Q100 128 52 122 Z" fill="${hc}" stroke="${INK}" stroke-width="4"/>`
    }[c.style] || '';
    const top = {
      long:  `<path d="M58 78 Q60 38 100 38 Q142 38 142 78 Q122 56 92 62 Q74 66 58 78 Z" fill="${hc}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`,
      plait: `<path d="M60 76 Q62 40 100 40 Q138 40 140 76 Q110 54 60 76 Z" fill="${hc}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`,
      bob:   `<path d="M58 80 Q60 38 100 38 Q140 38 142 80 Q140 60 100 60 Q62 60 58 80 Z" fill="${hc}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`,
      short: `<path d="M60 74 Q60 36 100 36 Q140 36 140 74 Q128 54 100 54 Q72 54 60 74 Z" fill="${hc}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`,
      curly: [[70,52],[86,42],[104,38],[122,44],[134,58],[62,66],[140,72]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="15" fill="${hc}" stroke="${INK}" stroke-width="4"/>`).join(''),
      bun:   `<circle cx="100" cy="30" r="17" fill="${hc}" stroke="${INK}" stroke-width="4"/><path d="M60 76 Q60 38 100 38 Q140 38 140 76 Q120 56 100 58 Q80 56 60 76 Z" fill="${hc}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`,
      cap:   `<path d="M56 64 Q60 30 100 30 Q142 30 146 62 Z" fill="#6B5B45" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M50 64 L150 64 Q160 66 152 72 L52 70 Z" fill="#5A4B38" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`,
      beanie:`<path d="M56 70 Q56 26 100 26 Q144 26 144 70 Z" fill="#2E4A6B" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><rect x="52" y="60" width="96" height="14" rx="6" fill="#3E5F86" stroke="${INK}" stroke-width="4"/>`
    }[c.style] || '';
    const x = c.extras || [];
    const acc = [
      x.includes('beard') ? `<path d="M62 100 Q66 146 100 148 Q134 146 138 100 Q126 122 100 122 Q74 122 62 100 Z" fill="${hc}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` : '',
      x.includes('stubble') ? `<path d="M68 110 Q100 140 132 110" fill="none" stroke="${INK}" stroke-width="2" stroke-dasharray="2 5" opacity=".6"/>` : '',
      x.includes('freckles') ? `<g fill="#B5734F">${[[78,104],[84,108],[72,108],[122,104],[116,108],[128,108]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="1.8"/>`).join('')}</g>` : '',
      x.includes('glasses') ? `<g fill="none" stroke="${INK}" stroke-width="3.5"><circle cx="82" cy="88" r="12"/><circle cx="118" cy="88" r="12"/><path d="M94 88 L106 88"/></g>` : '',
      x.includes('earrings') ? `<circle cx="58" cy="108" r="4" fill="#D8D8D8" stroke="${INK}" stroke-width="2"/><circle cx="142" cy="108" r="4" fill="#D8D8D8" stroke="${INK}" stroke-width="2"/>` : '',
      x.includes('headphones') ? `<path d="M56 150 Q100 176 144 150" fill="none" stroke="${INK}" stroke-width="7"/><circle cx="56" cy="150" r="10" fill="#333" stroke="${INK}" stroke-width="3"/><circle cx="144" cy="150" r="10" fill="#333" stroke="${INK}" stroke-width="3"/>` : '',
      x.includes('whistle') ? `<path d="M100 150 L100 172" stroke="${INK}" stroke-width="3"/><rect x="92" y="170" width="18" height="10" rx="4" fill="#C9C9C9" stroke="${INK}" stroke-width="3"/>` : '',
      x.includes('tie') ? `<path d="M100 150 L92 162 L100 196 L108 162 Z" fill="#1F3B5C" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>` : '',
      x.includes('badge') ? `<rect x="118" y="168" width="22" height="12" rx="3" fill="#fff" stroke="${INK}" stroke-width="3"/>` : '',
      x.includes('apron') ? `<path d="M70 160 L130 160 L136 200 L64 200 Z" fill="#2E6A4F" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` : ''
    ].join('');
    return `${back}<path d="M34 200 Q36 142 100 138 Q164 142 166 200 Z" fill="${c.clothes}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M88 124 L88 142 Q100 148 112 142 L112 124" fill="${sk}" stroke="${INK}" stroke-width="4"/>
      <ellipse cx="56" cy="94" rx="8" ry="11" fill="${sk}" stroke="${INK}" stroke-width="4"/><ellipse cx="144" cy="94" rx="8" ry="11" fill="${sk}" stroke="${INK}" stroke-width="4"/>
      <ellipse cx="${cx}" cy="${cy + 4}" rx="44" ry="50" fill="${sk}" stroke="${INK}" stroke-width="4"/>
      <ellipse cx="74" cy="${cy + 20}" rx="7" ry="4" fill="#F28B82" opacity=".35"/><ellipse cx="126" cy="${cy + 20}" rx="7" ry="4" fill="#F28B82" opacity=".35"/>
      ${top}${face(f, cx, cy, 18, 1)}${acc}`;
  }

  function animalSVG(c, f){
    const s = 1;
    switch (c.type){
      case 'puffin': return `<ellipse cx="100" cy="150" rx="58" ry="50" fill="#1E2328" stroke="${INK}" stroke-width="4"/><ellipse cx="100" cy="160" rx="38" ry="36" fill="#F6F4EE" stroke="${INK}" stroke-width="3"/>
        <circle cx="100" cy="86" r="50" fill="#1E2328" stroke="${INK}" stroke-width="4"/><ellipse cx="100" cy="90" rx="36" ry="32" fill="#F6F4EE"/>
        ${face(f, 100, 80, 17, .9)}<path d="M84 98 Q100 90 116 98 L100 120 Z" fill="#F07F2E" stroke="${INK}" stroke-width="4" stroke-linejoin="round" transform="translate(0,-4)"/>
        <path d="M64 130 Q100 148 136 130" fill="none" stroke="#2E6A8F" stroke-width="8" stroke-linecap="round"/><path d="M76 196 l-10 4 l18 0z M124 196 l10 4 l-18 0z" fill="#F07F2E" stroke="${INK}" stroke-width="3"/>`;
      case 'hare': return `<path d="M74 60 Q60 0 76 4 Q92 8 90 60 Z" fill="#B58459" stroke="${INK}" stroke-width="4"/><path d="M110 60 Q108 8 124 4 Q140 0 126 60 Z" fill="#B58459" stroke="${INK}" stroke-width="4"/>
        <path d="M78 54 Q72 18 78 14 Q86 18 84 54Z M116 54 Q114 18 122 14 Q128 18 122 54Z" fill="#E9B8A6"/>
        <ellipse cx="100" cy="164" rx="52" ry="40" fill="#B58459" stroke="${INK}" stroke-width="4"/><ellipse cx="100" cy="170" rx="30" ry="26" fill="#EBD8C2"/>
        <ellipse cx="100" cy="96" rx="46" ry="42" fill="#B58459" stroke="${INK}" stroke-width="4"/><rect x="58" y="58" width="84" height="12" rx="6" fill="#E2AE2F" stroke="${INK}" stroke-width="3"/>
        ${face(f, 100, 92, 17, .9)}<ellipse cx="100" cy="108" rx="5" ry="4" fill="#C9605A"/>`;
      case 'fox': return `<path d="M58 70 L48 20 L88 52 Z M142 70 L152 20 L112 52 Z" fill="#D9672A" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
        <path d="M150 190 Q196 170 184 120 Q176 160 140 168 Z" fill="#D9672A" stroke="${INK}" stroke-width="4"/><path d="M184 120 Q190 136 180 146 Q178 130 184 120Z" fill="#fff" stroke="${INK}" stroke-width="3"/>
        <ellipse cx="100" cy="164" rx="50" ry="40" fill="#D9672A" stroke="${INK}" stroke-width="4"/><ellipse cx="100" cy="172" rx="26" ry="24" fill="#F6EEE2"/>
        <path d="M54 76 Q56 40 100 40 Q144 40 146 76 Q150 112 100 132 Q50 112 54 76 Z" fill="#D9672A" stroke="${INK}" stroke-width="4"/><path d="M68 100 Q100 140 132 100 Q120 124 100 128 Q80 124 68 100Z" fill="#F6EEE2"/>
        ${face(f, 100, 84, 18, .9)}<ellipse cx="100" cy="104" rx="6" ry="4.5" fill="${INK}"/><path d="M112 140 l16 22 l-30 0z" fill="#7A5230" stroke="${INK}" stroke-width="3"/>`;
      case 'badger': return `<ellipse cx="100" cy="164" rx="58" ry="40" fill="#8C8C8C" stroke="${INK}" stroke-width="4"/><path d="M60 150 L140 150 L134 196 L66 196Z" fill="#E8DCC8" stroke="${INK}" stroke-width="3"/>
        <ellipse cx="100" cy="92" rx="48" ry="44" fill="#F4F1EA" stroke="${INK}" stroke-width="4"/><path d="M72 52 Q78 96 82 132 L66 120 Q56 84 72 52Z M128 52 Q122 96 118 132 L134 120 Q144 84 128 52Z" fill="#1E2328"/>
        <circle cx="58" cy="58" r="10" fill="#8C8C8C" stroke="${INK}" stroke-width="4"/><circle cx="142" cy="58" r="10" fill="#8C8C8C" stroke="${INK}" stroke-width="4"/>
        ${face(f, 100, 88, 20, .9, '#fff')}<ellipse cx="100" cy="112" rx="7" ry="5" fill="${INK}"/><path d="M150 176 l20 -40" stroke="#A0703C" stroke-width="6" stroke-linecap="round"/><ellipse cx="172" cy="132" rx="7" ry="10" fill="#A0703C" stroke="${INK}" stroke-width="3"/>`;
      case 'robin': return `<path d="M150 120 L190 100 L180 130Z" fill="#7A5638" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
        <circle cx="100" cy="112" r="70" fill="#8A6142" stroke="${INK}" stroke-width="4"/><path d="M52 112 Q60 70 100 70 Q140 70 148 112 Q140 170 100 172 Q60 170 52 112Z" fill="#D9542E"/>
        ${face(f, 100, 98, 22, 1)}<g fill="none" stroke="${INK}" stroke-width="3"><circle cx="78" cy="98" r="11"/><circle cx="122" cy="98" r="11"/><path d="M89 98 L111 98"/></g>
        <path d="M92 112 L108 112 L100 124Z" fill="#E2AE2F" stroke="${INK}" stroke-width="3" stroke-linejoin="round" transform="translate(0,-2)"/>`;
    }
    return '';
  }

  let artIndex = null;
  fetch('art/index.json').then(r => r.ok ? r.json() : null).then(j => { artIndex = j; }).catch(() => {});

  window.CAST = CAST;
  window.EXPRESSIONS = EXPRESSIONS;
  window.castSVG = function(id, expr){
    const c = CAST[id] || CAST.grainne, f = FACE[expr] || FACE.neutral;
    const inner = c.type === 'person' ? personSVG(c, f) : animalSVG(c, f);
    const tilt = f.tilt ? ` transform="rotate(${f.tilt} 100 110)"` : '';
    return `<svg xmlns="${NS}" viewBox="0 0 200 200" role="img" aria-label="${c.name}"><g${tilt}>${inner}</g>${extras(f, 100, 88, c.clothes || '#8A6142')}</svg>`;
  };
  // A character element. setExpr() changes the face; talk(true/false) flaps the mouth while audio plays.
  window.castEl = function(id, expr, cls){
    const el = document.createElement('div');
    el.className = 'cast' + (cls ? ' ' + cls : '');
    el.dataset.id = id;
    let current = '', flap = null;
    const draw = e => {
      if (e === current) return;
      current = e;
      const file = 'art/cast/' + id + '/' + e + '.webp';
      if (artIndex && artIndex.files && artIndex.files.includes(file)) el.innerHTML = `<img src="${file}" alt="${(CAST[id] || {}).name || ''}">`;
      else el.innerHTML = window.castSVG(id, e);
    };
    el.setExpr = e => { el.expr = e; if (!flap) draw(e); };
    el.talk = on => {
      clearInterval(flap); flap = null;
      if (on && !matchMedia('(prefers-reduced-motion: reduce)').matches){ let open = false; flap = setInterval(() => { open = !open; draw(open ? 'talking' : el.expr === 'talking' ? 'neutral' : el.expr); }, 140); }
      else draw(on ? 'talking' : el.expr);
    };
    el.setExpr(expr || 'neutral');
    return el;
  };
})();
