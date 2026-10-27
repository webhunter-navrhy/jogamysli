// Jóga mysli: menu, objevování, dýchání jen na obrazovce, přehrávač meditace, video, pás obrazů, formulář.
(function () {
  var d = document, root = d.documentElement;
  root.classList.add('js');
  var klid = matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  // dýchající obraz: animace běží jen když je vidět
  d.querySelectorAll('.dech').forEach(function (el) {
    new IntersectionObserver(function (e) { el.classList.toggle('mimo', !e[0].isIntersecting); }).observe(el);
  });

  // přehrávač meditace
  function cas(s) { s = Math.floor(s || 0); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
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

  // video: načte se až po kliknutí, mobil dostane menší soubor
  d.querySelectorAll('[data-video]').forEach(function (v) {
    v.querySelector('.video-play').addEventListener('click', function () {
      var el = d.createElement('video');
      el.src = innerWidth < 800 ? v.dataset.srcMobil : v.dataset.src;
      el.controls = true; el.playsInline = true; el.autoplay = true;
      el.setAttribute('poster', v.querySelector('img').currentSrc || v.querySelector('img').src);
      v.appendChild(el); v.classList.add('bezi'); el.play().catch(function () {});
    });
  });

  // pás obrazů: o kolik se má posunout (počítá se jen při změně velikosti)
  d.querySelectorAll('[data-pas]').forEach(function (pas) {
    var stopa = pas.querySelector('.pas-stopa');
    function zmer() { pas.style.setProperty('--posun', Math.max(0, stopa.scrollWidth - pas.clientWidth) + 'px'); }
    zmer(); addEventListener('resize', zmer); addEventListener('load', zmer);
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
