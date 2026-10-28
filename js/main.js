// Jóga mysli: menu, objevování, rotace jen na obrazovce, přehrávače meditace, video v okně, formulář.
(function () {
  var d = document, root = d.documentElement;
  root.classList.add('js');
  var klid = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function cas(s) { s = Math.floor(s || 0); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }

  // hlavička: linka po odscrollování (jen přepnutí třídy, bez smyčky)
  var hl = d.querySelector('.hlavicka');
  var znacka = d.createElement('div'); znacka.style.cssText = 'position:absolute;top:0;height:8px;width:1px';
  d.body.prepend(znacka);
  new IntersectionObserver(function (e) { hl.classList.toggle('posunuto', !e[0].isIntersecting); }).observe(znacka);

  // burger
  var burger = d.querySelector('.burger'), menu = d.getElementById('menu');
  function zavri() { burger.setAttribute('aria-expanded', 'false'); menu.classList.remove('otevreno'); d.body.classList.remove('menu-on'); }
  burger.addEventListener('click', function () {
    var on = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', on); menu.classList.toggle('otevreno', on); d.body.classList.toggle('menu-on', on);
  });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) zavri(); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') zavri(); });
  addEventListener('resize', function () { if (innerWidth > 1080) zavri(); });

  // objevování obsahu
  var r = d.querySelectorAll('.r');
  if (klid || !('IntersectionObserver' in window)) { r.forEach(function (el) { el.classList.add('vid'); }); }
  else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('vid'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    r.forEach(function (el) { io.observe(el); });
  }

  // nekonečné otáčení (slunce, paprsky, pečeť) běží jen když je vidět
  d.querySelectorAll('.ha-vizual, .hlava-vizual, .kontakt').forEach(function (el) {
    new IntersectionObserver(function (e) { el.classList.toggle('mimo', !e[0].isIntersecting); }).observe(el);
  });

  // jen jedna nahrávka hraje najednou
  d.addEventListener('play', function (e) {
    d.querySelectorAll('audio').forEach(function (a) { if (a !== e.target) a.pause(); });
  }, true);

  // malý přehrávač v úvodu
  d.querySelectorAll('[data-mini]').forEach(function (p) {
    var a = p.querySelector('audio'), b = p.querySelector('button'), cara = p.querySelector('.prehr-cara i'), t = p.querySelector('[data-mini-cas]');
    b.addEventListener('click', function () { if (a.paused) { a.play(); } else { a.pause(); } });
    a.addEventListener('play', function () { p.classList.add('hraje'); b.setAttribute('aria-label', 'Pozastavit ukázku meditace'); });
    a.addEventListener('pause', function () { p.classList.remove('hraje'); b.setAttribute('aria-label', 'Přehrát ukázku meditace'); });
    a.addEventListener('timeupdate', function () {
      if (a.duration) cara.style.width = (a.currentTime / a.duration * 100) + '%';
      if (t) t.textContent = cas(a.currentTime);
    });
  });

  // přehrávač meditace (deska)
  d.querySelectorAll('[data-prehravac]').forEach(function (p) {
    var a = p.querySelector('audio'), cara = p.querySelector('.prubeh-cara'), ted = p.querySelector('[data-ted]'), popis = p.querySelector('[data-popis]');
    function prepni() { if (a.paused) { a.play(); } else { a.pause(); } }
    p.querySelectorAll('.prehrat, [data-hrat]').forEach(function (b) { b.addEventListener('click', prepni); });
    a.addEventListener('play', function () { p.classList.add('hraje'); popis.textContent = 'Pozastavit'; });
    a.addEventListener('pause', function () { p.classList.remove('hraje'); popis.textContent = a.currentTime > 0 && !a.ended ? 'Pokračovat' : 'Přehrát ukázku'; });
    a.addEventListener('timeupdate', function () {
      ted.textContent = cas(a.currentTime);
      if (a.duration) cara.style.strokeDashoffset = 100 - (a.currentTime / a.duration) * 100;
    });
    a.addEventListener('ended', function () { cara.style.strokeDashoffset = 100; ted.textContent = '0:00'; });
  });

  // video v okně: načte se až po kliknutí, mobil dostane menší soubor
  d.querySelectorAll('[data-video]').forEach(function (btn) {
    var okno = d.getElementById(btn.dataset.video);
    if (!okno) return;
    var vid = okno.querySelector('video');
    btn.addEventListener('click', function () {
      if (!vid.src) vid.src = innerWidth < 800 ? btn.dataset.srcMobil : btn.dataset.src;
      if (okno.showModal) okno.showModal(); else okno.setAttribute('open', '');
      vid.play().catch(function () {});
    });
    okno.addEventListener('close', function () { vid.pause(); });
    okno.querySelector('.okno-zavrit').addEventListener('click', function () { okno.close(); });
    okno.addEventListener('click', function (e) { if (e.target === okno) okno.close(); });
  });

  // odkazy „Mám zájem“ předvyplní formulář
  d.querySelectorAll('[data-zajem]').forEach(function (a) {
    a.addEventListener('click', function () {
      var s = d.querySelector('#formular select[name=zajem]');
      if (s) s.value = a.dataset.zajem;
    });
  });

  // formulář: v návrhu ukázkový režim
  d.querySelectorAll('form.formular').forEach(function (f) {
    var stav = f.querySelector('.formular-stav');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (f.querySelector('.past input').value) return;
      var endpoint = f.getAttribute('data-endpoint');
      if (f.getAttribute('data-demo') === '1' || !endpoint) {
        stav.textContent = 'Ukázka formuláře: nic se neodesílá. Po spuštění webu dorazí zpráva Radaně na e-mail.';
        return;
      }
      stav.textContent = 'Odesílám…';
      fetch(endpoint, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } })
        .then(function (r) { if (!r.ok) throw new Error(r.status); f.reset(); stav.textContent = 'Děkuji, zpráva je odeslaná. Ozvu se vám.'; })
        .catch(function () { stav.textContent = 'Odeslání se nepodařilo. Napište mi prosím na radana@makarius.cz.'; });
    });
  });
})();
