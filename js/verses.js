/*
  Citações bíblicas com preview ao passar o mouse (ou tocar, no celular).
  Marque o texto assim: <span class="verse-ref" data-ref="Gn 1.1">Gn 1.1</span>
  Aceita: "Gn 1.1", "Gn 1:1", "Fp 2.9-11" (intervalo), "Nm 23" (capítulo inteiro).
  Busca o texto em https://bible-api.com (tradução Almeida, domínio público).
*/
(function(){

  var BOOKS = {
    'gn':'Gênesis', 'êx':'Êxodo', 'ex':'Êxodo', 'lv':'Levítico', 'nm':'Números', 'dt':'Deuteronômio',
    'js':'Josué', 'jz':'Juízes', 'rt':'Rute', '1sm':'1 Samuel', '2sm':'2 Samuel',
    '1rs':'1 Reis', '2rs':'2 Reis', '1cr':'1 Crônicas', '2cr':'2 Crônicas',
    'ed':'Esdras', 'ne':'Neemias', 'et':'Ester', 'jó':'Jó', 'sl':'Salmos', 'pv':'Provérbios',
    'ec':'Eclesiastes', 'ct':'Cânticos', 'is':'Isaías', 'jr':'Jeremias', 'lm':'Lamentações',
    'ez':'Ezequiel', 'dn':'Daniel', 'os':'Oséias', 'jl':'Joel', 'am':'Amós', 'ob':'Obadias',
    'jn':'Jonas', 'mq':'Miquéias', 'na':'Naum', 'hc':'Habacuque', 'sf':'Sofonias', 'ag':'Ageu',
    'zc':'Zacarias', 'ml':'Malaquias',
    'mt':'Mateus', 'mc':'Marcos', 'lc':'Lucas', 'jo':'João', 'at':'Atos', 'rm':'Romanos',
    '1co':'1 Coríntios', '2co':'2 Coríntios', 'gl':'Gálatas', 'ef':'Efésios', 'fp':'Filipenses',
    'cl':'Colossenses', '1ts':'1 Tessalonicenses', '2ts':'2 Tessalonicenses',
    '1tm':'1 Timóteo', '2tm':'2 Timóteo', 'tt':'Tito', 'fm':'Filemom', 'hb':'Hebreus',
    'tg':'Tiago', '1pe':'1 Pedro', '2pe':'2 Pedro', '1jo':'1 João', '2jo':'2 João', '3jo':'3 João',
    'jd':'Judas', 'ap':'Apocalipse'
  };

  var cache = {};
  try{ cache = JSON.parse(localStorage.getItem('versePreviewCache') || '{}'); }catch(e){ cache = {}; }
  function saveCache(){ try{ localStorage.setItem('versePreviewCache', JSON.stringify(cache)); }catch(e){} }

  function parseRef(raw){
    var m = raw.trim().match(/^(\d\s*)?([A-Za-zÀ-ÿ]+)\.?\s+(\d+)(?:[.:](\d+)(?:-(\d+))?)?$/);
    if(!m) return null;
    var key = ((m[1] || '').replace(/\s+/g,'') + m[2]).toLowerCase();
    var book = BOOKS[key];
    if(!book) return null;
    return { book: book, chapter: m[3], verse: m[4] || null, end: m[5] || null };
  }

  function apiUrl(ref){
    var loc = ref.book + ' ' + ref.chapter;
    if(ref.verse){ loc += ':' + ref.verse; if(ref.end) loc += '-' + ref.end; }
    return 'https://bible-api.com/' + encodeURIComponent(loc) + '?translation=almeida';
  }

  function fetchVerse(raw, cb){
    if(cache[raw]){ cb(null, cache[raw]); return; }
    var ref = parseRef(raw);
    if(!ref){ cb('unparseable'); return; }
    fetch(apiUrl(ref)).then(function(res){
      if(!res.ok) throw new Error('http ' + res.status);
      return res.json();
    }).then(function(data){
      if(!data || !data.text){ cb('empty'); return; }
      var text = data.text.replace(/\s+/g, ' ').trim();
      if(text.length > 480){ text = text.slice(0, 470).replace(/\s+\S*$/, '') + '…'; }
      cache[raw] = text;
      saveCache();
      cb(null, text);
    }).catch(function(){ cb('network'); });
  }

  /* ---- tooltip element (one shared instance, repositioned per hover) ---- */
  var tip = document.createElement('div');
  tip.className = 'verse-tooltip';
  tip.setAttribute('role', 'tooltip');
  document.body.appendChild(tip);

  var activeEl = null;
  var showTimer = null;
  var hideTimer = null;

  function positionTip(el){
    var r = el.getBoundingClientRect();
    var tw = tip.offsetWidth, th = tip.offsetHeight;
    var left = r.left + r.width / 2 - tw / 2;
    left = Math.max(10, Math.min(left, window.innerWidth - tw - 10));
    var top = r.top - th - 10;
    var flipped = false;
    if(top < 10){ top = r.bottom + 10; flipped = true; }
    tip.style.left = left + 'px';
    tip.style.top = top + 'px';
    tip.classList.toggle('below', flipped);
  }

  function renderLoading(){
    tip.innerHTML = '<span class="vt-loading">carregando…</span>';
  }
  function renderError(refText){
    tip.innerHTML = '<span class="vt-ref">' + refText + '</span><span class="vt-error">não foi possível carregar o texto agora.</span>';
  }
  function renderVerse(refText, text){
    tip.innerHTML = '<span class="vt-ref">' + refText + '</span><p class="vt-text">“' + text + '”</p>';
  }

  function openTip(el){
    activeEl = el;
    var refText = el.getAttribute('data-ref');
    renderLoading();
    tip.classList.add('show');
    positionTip(el);
    fetchVerse(refText, function(err, text){
      if(activeEl !== el) return; /* user moved on before the fetch finished */
      if(err){ renderError(refText); } else { renderVerse(refText, text); }
      positionTip(el);
    });
  }

  function closeTip(){
    activeEl = null;
    tip.classList.remove('show');
  }

  function bind(el){
    el.setAttribute('tabindex', '0');
    el.addEventListener('mouseenter', function(){
      clearTimeout(hideTimer);
      showTimer = setTimeout(function(){ openTip(el); }, 120);
    });
    el.addEventListener('mouseleave', function(){
      clearTimeout(showTimer);
      hideTimer = setTimeout(closeTip, 80);
    });
    el.addEventListener('focus', function(){ openTip(el); });
    el.addEventListener('blur', closeTip);
    el.addEventListener('click', function(ev){
      ev.preventDefault();
      if(activeEl === el){ closeTip(); } else { openTip(el); }
    });
  }

  document.querySelectorAll('.verse-ref').forEach(bind);

  document.addEventListener('scroll', function(){ if(activeEl) positionTip(activeEl); }, { passive: true });
  document.addEventListener('click', function(ev){
    if(activeEl && !ev.target.closest('.verse-ref')){ closeTip(); }
  });

})();
