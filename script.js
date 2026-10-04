/* Galerie vidéo — les données sont dans videos.js.
   Pour corriger un titre : ouvrir videos.js et remplacer "title": null par "title": "Mon titre". */
(function () {
  'use strict';

  var GROUPS = [
    { cat: 'film',   label: 'Films réalisés',             fallback: 'Film' },
    { cat: 'cam',    label: 'En tant que chef-opérateur', fallback: 'Image' },
    { cat: 'clip',   label: 'Clips officiels',            fallback: 'Clip' },
    { cat: 'clipx',  label: 'Clips non-officiels',        fallback: 'Clip' },
    { cat: 'teaser', label: 'Teasers',                    fallback: 'Teaser' },
    { cat: 'sel',    label: 'Sélection',                  fallback: 'Vidéo' }
  ];
  var FILTERS = {
    all:    ['film', 'cam', 'clip', 'clipx', 'teaser', 'sel'],
    film:   ['film'],
    cam:    ['cam'],
    clip:   ['clip', 'clipx'],
    teaser: ['teaser']
  };

  var $groups = document.getElementById('groups');
  var $count = document.getElementById('count');
  var dlg = document.getElementById('player');
  var $frame = document.getElementById('player-frame');
  var $ptitle = document.getElementById('player-title');
  var $pext = document.getElementById('player-ext');
  var current = 'all';
  var visible = [];      // vidéos affichées, dans l'ordre
  var openIndex = -1;
  var lastFocus = null;

  /* ---------- utilitaires ---------- */
  function pageUrl(v) {
    return v.p === 'vimeo' ? 'https://vimeo.com/' + v.id : 'https://www.youtube.com/watch?v=' + v.id;
  }
  function thumbUrl(v) {
    return v.p === 'vimeo' ? 'img/vimeo/' + v.id + '.jpg' : 'https://i.ytimg.com/vi/' + v.id + '/hqdefault.jpg';
  }
  function embedUrl(v) {
    return v.p === 'vimeo'
      ? 'https://player.vimeo.com/video/' + v.id + '?autoplay=1&dnt=1'
      : 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(v.id) + '?autoplay=1&rel=0&playsinline=1';
  }
  function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }
  function gradient(id) {
    var h = hash(id) % 360;
    return 'linear-gradient(135deg,hsl(' + h + ',18%,12%),hsl(' + ((h + 40) % 360) + ',22%,28%) 55%,#0a0a0a)';
  }
  function safeGet(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function safeSet(k, val) { try { window.localStorage.setItem(k, val); } catch (e) { /* ignoré */ } }

  // numéro d'ordre par catégorie, pour les titres de secours
  var counters = {};
  VIDEOS.forEach(function (v) {
    counters[v.cat] = (counters[v.cat] || 0) + 1;
    v.n = counters[v.cat];
  });
  function fallbackTitle(v) {
    var g = GROUPS.filter(function (x) { return x.cat === v.cat; })[0];
    return g.fallback + ' ' + (v.n < 10 ? '0' : '') + v.n;
  }

  // titres récupérés en ligne lors d'une visite précédente
  var cache = {};
  try { cache = JSON.parse(safeGet('mdb-titles-v1') || '{}') || {}; } catch (e) { cache = {}; }
  function titleOf(v) { return v.title || cache[v.id] || fallbackTitle(v); }
  function hasRealTitle(v) { return !!(v.title || cache[v.id]); }

  /* ---------- rendu ---------- */
  function render() {
    var cats = FILTERS[current];
    $groups.textContent = '';
    visible = [];

    GROUPS.forEach(function (g) {
      if (cats.indexOf(g.cat) === -1) return;
      var items = VIDEOS.filter(function (v) { return v.cat === g.cat; });
      if (!items.length) return;

      var sec = document.createElement('div');
      sec.className = 'group';
      var h3 = document.createElement('h3');
      h3.textContent = g.label + ' ';
      var cnt = document.createElement('span');
      cnt.textContent = String(items.length);
      h3.appendChild(cnt);
      var grid = document.createElement('div');
      grid.className = 'grid';

      items.forEach(function (v) {
        var idx = visible.length;
        visible.push(v);

        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'card';
        b.dataset.id = v.id;
        b.style.setProperty('--g', gradient(v.id));
        b.setAttribute('aria-label', 'Lire : ' + titleOf(v));

        var img = document.createElement('img');
        img.className = 'thumb';
        img.src = thumbUrl(v);
        img.alt = '';
        img.loading = 'lazy';
        img.decoding = 'async';
        img.onerror = function () { img.style.visibility = 'hidden'; };

        var play = document.createElement('span');
        play.className = 'play';
        play.setAttribute('aria-hidden', 'true');

        var meta = document.createElement('div');
        meta.className = 'meta';
        var t = document.createElement('h4');
        t.textContent = titleOf(v);
        var pf = document.createElement('span');
        pf.className = 'pf';
        pf.textContent = (v.p === 'vimeo' ? 'Vimeo' : 'YouTube');
        meta.appendChild(t);
        meta.appendChild(pf);

        b.appendChild(img);
        b.appendChild(play);
        b.appendChild(meta);
        b.addEventListener('click', function () { openPlayer(idx, b); });
        grid.appendChild(b);
      });

      sec.appendChild(h3);
      sec.appendChild(grid);
      $groups.appendChild(sec);
    });

    $count.textContent = visible.length + (visible.length > 1 ? ' vidéos' : ' vidéo');
  }

  /* ---------- lecteur ---------- */
  function openPlayer(i, trigger) {
    if (i < 0) i = visible.length - 1;
    if (i >= visible.length) i = 0;
    openIndex = i;
    var v = visible[i];
    if (trigger) lastFocus = trigger;

    $frame.textContent = '';
    var f = document.createElement('iframe');
    f.src = embedUrl(v);
    f.title = titleOf(v);
    f.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
    f.allowFullscreen = true;
    f.referrerPolicy = 'strict-origin-when-cross-origin';
    $frame.appendChild(f);

    $ptitle.textContent = titleOf(v);
    $pext.href = pageUrl(v);
    $pext.textContent = 'Ouvrir sur ' + (v.p === 'vimeo' ? 'Vimeo' : 'YouTube') + ' ↗';

    if (!dlg.open) {
      if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
      document.body.classList.add('lock');
    }
    try { history.replaceState(null, '', '#v=' + v.id); } catch (e) { /* ignoré */ }
  }

  function closePlayer() {
    if (typeof dlg.close === 'function') { if (dlg.open) dlg.close(); } else dlg.removeAttribute('open');
    afterClose();
  }
  function afterClose() {
    $frame.textContent = '';           // coupe la lecture
    document.body.classList.remove('lock');
    openIndex = -1;
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* ignoré */ }
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }

  dlg.addEventListener('close', afterClose);
  dlg.addEventListener('click', function (e) { if (e.target === dlg) closePlayer(); });
  document.getElementById('p-close').addEventListener('click', closePlayer);
  document.getElementById('p-prev').addEventListener('click', function () { openPlayer(openIndex - 1); });
  document.getElementById('p-next').addEventListener('click', function () { openPlayer(openIndex + 1); });
  document.addEventListener('keydown', function (e) {
    if (!dlg.open) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); openPlayer(openIndex - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); openPlayer(openIndex + 1); }
  });

  /* ---------- filtres ---------- */
  var btns = document.querySelectorAll('.filters button');
  Array.prototype.forEach.call(btns, function (b) {
    b.addEventListener('click', function () {
      Array.prototype.forEach.call(btns, function (x) { x.classList.remove('active'); x.setAttribute('aria-pressed', 'false'); });
      b.classList.add('active');
      b.setAttribute('aria-pressed', 'true');
      current = b.dataset.filter;
      render();
    });
  });

  var rnd = document.getElementById('random');
  if (rnd) rnd.addEventListener('click', function () {
    current = 'all';
    Array.prototype.forEach.call(btns, function (x) { var on = x.dataset.filter === 'all'; x.classList.toggle('active', on); x.setAttribute('aria-pressed', String(on)); });
    render();
    openPlayer(Math.floor(Math.random() * visible.length), rnd);
  });

  /* ---------- titres manquants : récupérés en ligne chez le visiteur ---------- */
  function updateTitle(v, title) {
    cache[v.id] = title;
    safeSet('mdb-titles-v1', JSON.stringify(cache));
    var card = $groups.querySelector('.card[data-id="' + v.id + '"]');
    if (card) {
      card.querySelector('h4').textContent = title;
      card.setAttribute('aria-label', 'Lire : ' + title);
    }
    if (dlg.open && visible[openIndex] && visible[openIndex].id === v.id) $ptitle.textContent = title;
  }
  function fetchTitle(v) {
    var url = 'https://noembed.com/embed?url=' + encodeURIComponent(pageUrl(v));
    return fetch(url).then(function (r) { return r.json(); }).then(function (j) {
      if (j && typeof j.title === 'string' && j.title.trim() && !j.error) updateTitle(v, j.title.trim());
    }).catch(function () { /* titre de secours conservé */ });
  }
  function hydrateTitles() {
    if (!window.fetch) return;
    var queue = VIDEOS.filter(function (v) { return !hasRealTitle(v); });
    function worker() {
      var v = queue.shift();
      if (!v) return;
      fetchTitle(v).then(worker);
    }
    for (var i = 0; i < 4; i++) worker();
  }

  /* ---------- démarrage ---------- */
  render();
  hydrateTitles();

  var m = /^#v=([\w-]+)$/.exec(location.hash);
  if (m) {
    for (var i = 0; i < visible.length; i++) {
      if (visible[i].id === m[1]) { openPlayer(i); break; }
    }
  }
})();
