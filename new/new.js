/*
 * Nový design detailu produktu – galerie + sbalený popis + přepínač designu.
 * Vanilla JS, žádné závislosti (jQuery/Slick původní stránky se nemění).
 *
 * Co dělá:
 *  1) Nastaví <html data-design="old|new"> (volba z ?design=, pak z localStorage, výchozí "new").
 *  2) Postaví novou galerii (#ng) z fotek původního slideru (#sldKartaID) – originál zůstane v DOM, jen skrytý.
 *  3) Sbalí dlouhý popis (.lypi-perex) s tlačítkem "Více…".
 *  4) Vloží plovoucí přepínač Původní / Nový design a Počítač / Mobil (mobil = stránka v rámu 390 px).
 */
(function () {
  'use strict';

  var KEY = 'a24-design';
  var VIEW_KEY = 'a24-view';
  var MOBILE_WIDTH = 390;
  var root = document.documentElement;
  // stránka načtená uvnitř mobilního rámu: bez přepínače, design se bere z ?design=
  var inFrame = new URLSearchParams(location.search).get('frame') === '1';

  /* ---------- 1) volba designu (hned, ať nebliká) ---------- */
  function readMode() {
    var q = new URLSearchParams(location.search).get('design');
    if (q === 'old' || q === 'new') return q;
    try { return localStorage.getItem(KEY) || 'new'; } catch (e) { return 'new'; }
  }
  var mode = readMode();
  root.setAttribute('data-design', mode);

  function setMode(m) {
    mode = m;
    root.setAttribute('data-design', m);
    try { localStorage.setItem(KEY, m); } catch (e) {}
    var btns = document.querySelectorAll('.ds-btn[data-mode]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute('aria-pressed', btns[i].getAttribute('data-mode') === m ? 'true' : 'false');
    }
    // Slick v původní galerii se počítá podle šířky – po zobrazení znovu přepočítat.
    if (window.jQuery) {
      try { window.jQuery('#sldKartaID').slick('setPosition'); } catch (e) {}
    }
    // v mobilním náhledu načíst rám znovu se zvoleným designem
    var f = document.querySelector('.dsm iframe');
    if (f) f.src = frameUrl();
  }

  /* ---------- mobilní náhled: stejná stránka v rámu široké 390 px (media queries se řídí šířkou rámu) ---------- */
  function frameUrl() {
    var u = new URL(location.href);
    u.searchParams.set('frame', '1');
    u.searchParams.set('design', mode);
    return u.toString();
  }

  function setView(v) {
    try { localStorage.setItem(VIEW_KEY, v); } catch (e) {}
    var btns = document.querySelectorAll('.ds-btn[data-view]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute('aria-pressed', btns[i].getAttribute('data-view') === v ? 'true' : 'false');
    }
    var box = document.querySelector('.dsm');
    if (v === 'mobile') {
      if (!box) {
        box = el('div', 'dsm');
        var f = el('iframe', '', { title: 'Náhled na mobilu', src: frameUrl() });
        f.style.width = MOBILE_WIDTH + 'px';
        box.appendChild(f);
        document.body.appendChild(box);
      }
      document.body.classList.add('ng-lock');
    } else {
      if (box) box.parentNode.removeChild(box);
      if (!document.querySelector('.nm:not([hidden])')) document.body.classList.remove('ng-lock');
    }
  }

  function readView() {
    try { return localStorage.getItem(VIEW_KEY) === 'mobile' ? 'mobile' : 'desktop'; } catch (e) { return 'desktop'; }
  }

  function el(tag, cls, attrs) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (attrs) for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }

  /* ---------- přepínač ---------- */
  function buildSwitch() {
    var box = el('div', 'ds', { role: 'group', 'aria-label': 'Přepínač designu' });
    box.innerHTML =
      '<span class="ds-label">Design</span>' +
      '<button type="button" class="ds-btn" data-mode="old">Původní</button>' +
      '<button type="button" class="ds-btn" data-mode="new">Nový</button>' +
      '<span class="ds-sep"></span>' +
      '<span class="ds-label">Zobrazení</span>' +
      '<button type="button" class="ds-btn" data-view="desktop">Počítač</button>' +
      '<button type="button" class="ds-btn" data-view="mobile">Mobil</button>' +
      '<span class="ds-sep"></span>' +
      '<button type="button" class="ds-btn ds-info" aria-haspopup="dialog">Co je nového</button>';
    box.addEventListener('click', function (e) {
      var b = e.target.closest('.ds-btn');
      if (!b) return;
      if (b.classList.contains('ds-info')) { openChanges(); return; }
      if (b.hasAttribute('data-mode')) setMode(b.getAttribute('data-mode'));
      else setView(b.getAttribute('data-view'));
    });
    document.body.appendChild(box);
  }

  /* ---------- okno „Co je nového“: stručný přehled změn (jen pro testování, maže se s přepínačem) ---------- */
  var CHANGES = [
    ['Galerie', 'Velká fotka a pod ní jedna řada náhledů (posun prstem nebo tažením myši). Aktivní fotka má oranžové podtržení. Klik na fotku otevře všechny fotky pod sebou se zvětšením.'],
    ['Počet fotek a videí', 'Pod náhledy (např. 11 fotek, 1 video). Ikona videa se přesunula z pravého sloupce sem.'],
    ['Popis', 'Dlouhý text je sbalený, celý se otevře přes „Více…“ v okně s větším písmem a hlavními přednostmi.'],
    ['Nadpisy', 'Popis a Ostatní modely mají šedý pruh s oranžovým proužkem vlevo.'],
    ['Porovnání a výbava', 'Tlačítka jsou hned pod cenou, ve stylu záložek specifikace.'],
    ['Ostatní modely', 'Vidět jsou 4, zbytek přes „Více…“. Blok je na středu.'],
    ['Tlačítka', 'Jednotná velikost. Cena a KOUPIT TEĎ beze změny.'],
    ['Přepínač', 'Původní / Nový design a Počítač / Mobil slouží jen pro vyzkoušení.']
  ];
  function openChanges() {
    var m = document.querySelector('.dsc');
    if (!m) {
      m = el('div', 'dsc', { role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Co je nového' });
      var list = CHANGES.map(function (c) { return '<li><b>' + c[0] + ':</b> ' + c[1] + '</li>'; }).join('');
      m.innerHTML = '<div class="dsc-box"><button type="button" class="dsc-close" aria-label="Zavřít">×</button>' +
        '<h2 class="dsc-h">Co je v novém designu jinak</h2><ul class="dsc-list">' + list + '</ul></div>';
      m.addEventListener('click', function (e) { if (e.target === m || e.target.closest('.dsc-close')) m.hidden = true; });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') m.hidden = true; });
      document.body.appendChild(m);
    }
    m.hidden = false;
  }

  /* ---------- 2) galerie ---------- */
  function thumbOf(img) {
    var ss = img.getAttribute('srcset') || '';
    var best = null;
    ss.split(',').forEach(function (part) {
      var p = part.trim().split(/\s+/);
      if (p.length === 2 && p[1] === '440w') best = p[0];
    });
    return best || img.getAttribute('src');
  }
  function ytId(src) {
    var m = /embed\/([\w-]+)/.exec(src || '');
    return m ? m[1] : null;
  }

  function collectItems() {
    var slides = document.querySelectorAll('#sldKartaID .slick-slide:not(.slick-cloned)');
    if (!slides.length) slides = document.querySelectorAll('#sldKartaID > div');
    var items = [], seen = {};
    for (var i = 0; i < slides.length; i++) {
      var img = slides[i].querySelector('img');
      var fr = slides[i].querySelector('iframe');
      if (img) {
        var full = img.getAttribute('src');
        if (seen[full]) continue;
        seen[full] = 1;
        items.push({ type: 'img', full: full, thumb: thumbOf(img), alt: img.getAttribute('alt') || '' });
      } else if (fr) {
        var src = fr.getAttribute('src') || fr.getAttribute('data-src');
        var id = ytId(src);
        items.push({ type: 'video', embed: src, thumb: id ? 'https://img.youtube.com/vi/' + id + '/hqdefault.jpg' : '', alt: 'Video' });
      }
    }
    return items;
  }

  function buildGallery() {
    var host = document.querySelector('.lyp-gal');
    if (!host || document.getElementById('ng')) return;
    var items = collectItems();
    if (!items.length) return;


    var ng = el('div', 'ng', { id: 'ng' });
    ng.innerHTML =
      '<div class="ng-stage">' +
        '<div class="ng-view"></div>' +
        '<button type="button" class="ng-zoom" aria-label="Zvětšit"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg></button>' +
        '<button type="button" class="ng-ar ng-ar-over ng-ar-l" data-dir="-1" aria-label="Předchozí"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>' +
        '<button type="button" class="ng-ar ng-ar-over ng-ar-r" data-dir="1" aria-label="Další"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>' +
      '</div>' +
      '<div class="ng-row">' +
        '<button type="button" class="ng-ar" data-dir="-1" aria-label="Předchozí"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>' +
        '<div class="ng-strip" role="tablist"></div>' +
        '<button type="button" class="ng-ar" data-dir="1" aria-label="Další"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>' +
      '</div>' +
      '<div class="ng-info"></div>';
    host.insertBefore(ng, host.firstChild);

    var view = ng.querySelector('.ng-view');
    var strip = ng.querySelector('.ng-strip');
    var count = ng.querySelector('.ng-info');
    var idx = 0;
    var thumbs = [];

    items.forEach(function (it, i) {
      var b = el('button', 'ng-th' + (it.type === 'video' ? ' ng-th-video' : ''), { type: 'button', role: 'tab', 'aria-label': it.alt });
      b.innerHTML = '<img loading="lazy" src="' + it.thumb + '" alt="">' + (it.type === 'video' ? '<i class="ng-play"></i>' : '');
      b.addEventListener('click', function () { show(i); });
      strip.appendChild(b);
      thumbs.push(b);
    });

    function render(target, it) {
      target.innerHTML = '';
      if (it.type === 'img') {
        var im = el('img', '', { src: it.full, alt: it.alt, draggable: 'false' });
        target.appendChild(im);
      } else {
        var f = el('iframe', 'ng-video', { src: it.embed, allowfullscreen: '', referrerpolicy: 'strict-origin-when-cross-origin' });
        target.appendChild(f);
      }
    }

    var nP = items.filter(function (x) { return x.type === 'img'; }).length;
    var nV = items.length - nP;

    // počet + ikona jako původní ikona videa vpravo; klik skočí na první fotku / první video
    count.innerHTML =
      '<span class="ng-i ng-i-img" data-go="img" title="Fotografie">' + nP + '<i></i></span>' +
      (nV ? '<span class="ng-i ng-i-video" data-go="video" title="Videa">' + nV + '<i></i></span>' : '');
    count.addEventListener('click', function (e) {
      var g = e.target.closest('[data-go]');
      if (!g) return;
      var k = items.findIndex(function (x) { return x.type === g.getAttribute('data-go'); });
      if (k >= 0) show(k);
    });

    function show(i) {
      idx = (i + items.length) % items.length;
      render(view, items[idx]);
      thumbs.forEach(function (t, k) { t.classList.toggle('active', k === idx); t.setAttribute('aria-selected', k === idx ? 'true' : 'false'); });
      var t = thumbs[idx];
      strip.scrollTo({ left: t.offsetLeft - (strip.clientWidth - t.offsetWidth) / 2, behavior: 'smooth' });
    }

    ng.querySelectorAll('.ng-ar').forEach(function (b) {
      b.addEventListener('click', function () { show(idx + parseInt(b.getAttribute('data-dir'), 10)); });
    });

    // swipe na hlavní fotce
    var sx = null, swiped = false;
    view.addEventListener('pointerdown', function (e) { sx = e.clientX; swiped = false; });
    view.addEventListener('pointercancel', function () { sx = null; });
    view.addEventListener('pointerup', function (e) {
      if (sx === null) return;
      var dx = e.clientX - sx; sx = null;
      if (Math.abs(dx) > 40) { swiped = true; show(idx + (dx < 0 ? 1 : -1)); }
    });

    /* ----- lightbox: všechny fotky (a video) pod sebou, scrolluje se, jde zvětšit ----- */
    var lb = el('div', 'ng-lb', { role: 'dialog', 'aria-modal': 'true', hidden: '' });
    lb.innerHTML =
      '<button type="button" class="ng-lb-close" aria-label="Zavřít"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg></button>' +
      '<span class="ng-lb-count"></span>' +
      '<div class="ng-lb-scroll"></div>';
    document.body.appendChild(lb);
    var lbScroll = lb.querySelector('.ng-lb-scroll');
    var lbCount = lb.querySelector('.ng-lb-count');
    var figs = [];
    var io = null;

    function lbBuild() {
      if (figs.length) return;
      items.forEach(function (it, i) {
        var f = el('figure', 'ng-lb-fig' + (it.type === 'video' ? ' is-video' : ''));
        f.setAttribute('data-i', i);
        if (it.type === 'img') {
          f.innerHTML = '<img loading="lazy" src="' + it.full + '" alt="' + it.alt + '">';
          // klepnutí / klik přepne zvětšení (na mobilu jde navíc štípnutím)
          f.addEventListener('click', function () { f.classList.toggle('zoom'); });
        } else {
          f.innerHTML = '<iframe class="ng-video" loading="lazy" src="' + it.embed + '" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>';
        }
        lbScroll.appendChild(f);
        figs.push(f);
      });
      if ('IntersectionObserver' in window) {
        io = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) { idx = parseInt(en.target.getAttribute('data-i'), 10); lbCount.textContent = (idx + 1) + ' / ' + items.length; }
          });
        }, { root: lbScroll, threshold: 0.5 });
        figs.forEach(function (f) { io.observe(f); });
      }
    }
    function lbOpen() {
      lbBuild();
      lb.hidden = false;
      document.body.classList.add('ng-lock');
      lbCount.textContent = (idx + 1) + ' / ' + items.length;
      figs[idx].scrollIntoView({ block: 'start' });
      view.innerHTML = '';
    }
    function lbClose() { lb.hidden = true; document.body.classList.remove('ng-lock'); show(idx); }

    ng.querySelector('.ng-zoom').addEventListener('click', lbOpen);
    view.addEventListener('click', function (e) { if (swiped) { swiped = false; return; } if (e.target.tagName === 'IMG') lbOpen(); });
    lb.querySelector('.ng-lb-close').addEventListener('click', lbClose);
    document.addEventListener('keydown', function (e) {
      if (mode === 'new' && !lb.hidden && e.key === 'Escape') lbClose();
    });

    // okraje řady: průhledný přechod ukazuje, že jde posouvat
    function edges() {
      var max = strip.scrollWidth - strip.clientWidth;
      ng.classList.toggle('can-left', strip.scrollLeft > 2);
      ng.classList.toggle('can-right', strip.scrollLeft < max - 2);
    }
    strip.addEventListener('scroll', edges, { passive: true });
    window.addEventListener('resize', edges);

    // posun řady tažením myší (na dotyku funguje nativně)
    var dragX = null, dragL = 0, moved = false;
    strip.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return;
      dragX = e.clientX; dragL = strip.scrollLeft; moved = false;
    });
    strip.addEventListener('pointermove', function (e) {
      if (dragX === null) return;
      var d = e.clientX - dragX;
      if (Math.abs(d) > 5) { moved = true; strip.classList.add('drag'); }
      if (moved) strip.scrollLeft = dragL - d;
    });
    window.addEventListener('pointerup', function () {
      dragX = null;
      setTimeout(function () { strip.classList.remove('drag'); }, 0);
    });
    strip.addEventListener('click', function (e) {
      if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; }
    }, true);

    show(0);
    edges();
  }

  /* ---------- 3) sbalený popis + modální okno s podrobnostmi ---------- */
  function pickSrc(img, w) {
    var best = null;
    (img.getAttribute('srcset') || '').split(',').forEach(function (part) {
      var p = part.trim().split(/\s+/);
      if (p.length === 2 && p[1] === w + 'w') best = p[0];
    });
    return best || img.getAttribute('src');
  }

  function buildModal(perex) {
    // text popisu rozdělíme na bloky podle dvojitého <br>: první dva = úvod, zbytek = podrobný text
    var blocks = perex.innerHTML.split(/(?:<br\s*\/?>\s*){2,}/i).filter(function (b) { return b.replace(/<[^>]*>|\s|&nbsp;/g, '') !== ''; });
    var intro = blocks.slice(0, 2).join('<br><br>');
    var detail = blocks.slice(2).join('<br><br>');

    var img = document.querySelector('#sldKartaID img');
    var h1 = document.querySelector('.lypi-h1');
    var hdl = document.querySelector('.lypi-hdl');

    var m = el('div', 'nm', { role: 'dialog', 'aria-modal': 'true', hidden: '' });
    m.innerHTML =
      '<div class="nm-box">' +
        '<button type="button" class="nm-close" aria-label="Zavřít"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg></button>' +
        (img ? '<img class="nm-photo" src="' + pickSrc(img, 1200) + '" alt="' + (h1 ? h1.textContent : '') + '">' : '') +
        '<h2 class="nm-title">' + (h1 ? h1.textContent : '') + '</h2>' +
        '<div class="nm-intro">' + intro + '</div>' +
        (hdl ? '<div class="nm-hdl">' + hdl.outerHTML + '</div>' : '') +
        (detail ? '<h3 class="nm-sub">Podrobný popis</h3><div class="nm-detail">' + detail + '</div>' : '') +
      '</div>';
    document.body.appendChild(m);

    function close() { m.hidden = true; document.body.classList.remove('ng-lock'); }
    m.addEventListener('click', function (e) { if (e.target === m || e.target.closest('.nm-close')) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !m.hidden) close(); });
    return m;
  }

  function buildCollapse() {
    var p = document.querySelector('.lypi-perex');
    if (!p || p.getAttribute('data-ng-done')) return;
    p.setAttribute('data-ng-done', '1');
    p.classList.add('ng-collapsible', 'is-collapsed');

    // tlačítko leží uprostřed mizejícího textu
    var wrap = el('div', 'ng-perex-wrap');
    p.parentNode.insertBefore(wrap, p);
    wrap.appendChild(p);
    // nadpis Popis nad sbaleným textem (v původním designu skrytý)
    var h = el('strong', 'ng-h');
    h.textContent = 'Popis';
    wrap.parentNode.insertBefore(h, wrap);
    var btn = el('button', 'ng-btn ng-btn-grey ng-more', { type: 'button', 'aria-haspopup': 'dialog' });
    btn.textContent = 'Více…';
    wrap.appendChild(btn);

    // Porovnání a výbava: šedá tlačítka hned pod cenou, klik se předá originálním odkazům (ty zůstávají funkční, jen skryté)
    var actions = el('div', 'ng-actions');
    ['.lypi-lm-menu a.porovnat', '.lypi-lm-menu a.doplnkovavybava'].forEach(function (sel) {
      var orig = document.querySelector(sel);
      if (!orig) return;
      var b = el('button', 'ng-btn ng-btn-grey', { type: 'button' });
      b.textContent = orig.textContent.trim();
      b.addEventListener('click', function () { orig.click(); });
      actions.appendChild(b);
    });
    var cena = document.querySelector('.lypi-cena');
    if (cena) cena.parentNode.insertBefore(actions, cena.nextSibling);
    else wrap.parentNode.insertBefore(actions, wrap);

    var modal = null;
    btn.addEventListener('click', function () {
      if (!modal) modal = buildModal(p);
      modal.hidden = false;
      modal.scrollTop = 0;
      modal.querySelector('.nm-box').scrollTop = 0;
      document.body.classList.add('ng-lock');
    });

    buildModels();
  }

  /* ---------- Ostatní modely: vidět jen 4, zbytek po kliknutí ---------- */
  function buildModels() {
    var menu = document.querySelector('.lypi-mp-rmenu .bl-menu');
    if (!menu || menu.getAttribute('data-ng-done')) return;
    var n = menu.querySelectorAll('a:not(.km-vice)').length;
    if (n <= 4) return;
    menu.setAttribute('data-ng-done', '1');
    menu.classList.add('ng-models', 'is-collapsed');

    var h = document.querySelector('.lypi-mp-rmenu .km-ostatni');
    if (h) {
      var c = el('span', 'ng-cnt');
      c.textContent = ' (' + n + ')';
      h.appendChild(c);
    }

    // seznam mizí do ztracena, tlačítko leží napůl přes jeho spodní okraj (stejně jako u popisu)
    var wrap = el('div', 'ng-models-wrap is-collapsed');
    menu.parentNode.insertBefore(wrap, menu);
    wrap.appendChild(menu);
    var more = el('button', 'ng-btn ng-btn-grey ng-more-m', { type: 'button', 'aria-expanded': 'false' });
    more.textContent = 'Více…';
    wrap.appendChild(more);
    more.addEventListener('click', function () {
      var open = menu.classList.toggle('is-collapsed') === false;
      wrap.classList.toggle('is-collapsed', !open);
      more.setAttribute('aria-expanded', open ? 'true' : 'false');
      more.textContent = open ? 'Méně…' : 'Více…';
    });
  }

  /* ---------- Jiný modelový rok: na mobilu rozbalovací jako záložky specifikace (vzhled jen v CSS pod 840 px) ---------- */
  function buildYears() {
    var t = document.querySelector('.lyp-time .timeline');
    if (!t || t.getAttribute('data-ng-done')) return;
    var h = t.querySelector('strong');
    if (!h) return;
    t.setAttribute('data-ng-done', '1');
    t.classList.add('ng-years');
    h.setAttribute('role', 'button');
    h.setAttribute('tabindex', '0');
    h.setAttribute('aria-expanded', 'false');
    h.appendChild(el('span', 'ng-acc-arr')).appendChild(el('i'));
    function toggle() {
      var open = t.classList.toggle('is-open');
      h.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    h.addEventListener('click', toggle);
    h.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  }

  /* ---------- testovací kopie: nic nikam nepřekliká (při nasazení smazat) ----------
     Odkazy v index.html vedou na "#", tady se navíc ruší výchozí akce kliknutí (skok na začátek, nové okno),
     odeslání formulářů a přepnutí jazyka (#changeHreflang mění window.location). Obsluha v rámci stránky
     (záložky, galerie, porovnání) dál běží, protože se nevolá stopPropagation. */
  function blockNavigation() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (a) e.preventDefault();
    }, true);
    document.addEventListener('submit', function (e) { e.preventDefault(); }, true);
    document.addEventListener('change', function (e) {
      if (e.target && e.target.id === 'changeHreflang') e.stopImmediatePropagation();
    }, true);
  }
  blockNavigation();

  function init() {
    if (!inFrame) buildSwitch();
    buildCollapse();
    buildYears();
    setMode(mode);
    if (!inFrame) setView(readView());
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  // galerii stavíme až po načtení, to už je původní Slick inicializovaný
  window.addEventListener('load', buildGallery);

})();
