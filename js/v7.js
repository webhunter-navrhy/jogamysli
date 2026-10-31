// Jóga mysli v7: menu, přehrávač ukázky meditace, video v okně, formulář. Nativní scroll, žádné efekty.
(function () {
  var d = document;
  function cas(s) { s = Math.floor(s || 0); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }

  // burger
  var burger = d.querySelector('.burger'), menu = d.getElementById('menu');
  if (burger && menu) {
    var zavri = function () { burger.setAttribute('aria-expanded', 'false'); menu.classList.remove('otevreno'); };
    burger.addEventListener('click', function () {
      var on = burger.getAttribute('aria-expanded') !== 'true';
      burger.setAttribute('aria-expanded', on); menu.classList.toggle('otevreno', on);
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) zavri(); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') zavri(); });
    addEventListener('resize', function () { if (innerWidth > 1180) zavri(); });
  }

  // jen jedna nahrávka hraje najednou
  d.addEventListener('play', function (e) {
    d.querySelectorAll('audio, video').forEach(function (a) { if (a !== e.target) a.pause(); });
  }, true);

  // přehrávač ukázky: tlačítko, čas a lineární průběh
  d.querySelectorAll('[data-prehravac]').forEach(function (p) {
    var a = p.querySelector('audio'), prubeh = p.querySelector('[data-prubeh]'), ted = p.querySelector('[data-ted]'), popis = p.querySelector('[data-popis]');
    p.querySelectorAll('[data-hrat]').forEach(function (b) {
      b.addEventListener('click', function () { if (a.paused) a.play().catch(function () {}); else a.pause(); });
    });
    a.addEventListener('play', function () { p.classList.add('hraje'); popis.textContent = 'Pozastavit'; });
    a.addEventListener('pause', function () { p.classList.remove('hraje'); popis.textContent = a.currentTime > 0 && !a.ended ? 'Pokračovat' : 'Přehrát ukázku'; });
    a.addEventListener('timeupdate', function () {
      ted.textContent = cas(a.currentTime);
      if (a.duration) prubeh.style.width = (a.currentTime / a.duration * 100) + '%';
    });
    a.addEventListener('ended', function () { prubeh.style.width = '0'; ted.textContent = '0:00'; });
  });

  // video v okně: načte se až po kliknutí, mobil dostane menší soubor
  d.querySelectorAll('[data-video]').forEach(function (btn) {
    var okno = d.getElementById(btn.dataset.video);
    if (!okno) return;
    var vid = okno.querySelector('video');
    btn.addEventListener('click', function () {
      if (!vid.getAttribute('src')) vid.src = innerWidth < 800 ? btn.dataset.srcMobil : btn.dataset.src;
      if (okno.showModal) okno.showModal(); else okno.setAttribute('open', '');
      vid.play().catch(function () {});
    });
    okno.addEventListener('close', function () { vid.pause(); });
    var z = okno.querySelector('.okno-zavrit'); if (z) z.addEventListener('click', function () { okno.close(); });
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
      var past = f.querySelector('.past input'); if (past && past.value) return;
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
