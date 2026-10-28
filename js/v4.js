// Jóga mysli v4: menu, přehrávač meditace, video v okně, formulář. Scroll je nativní, objevování řeší CSS (animation-timeline).
(function () {
  var d = document;
  var klid = matchMedia('(prefers-reduced-motion: reduce)').matches;
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

  // přehrávač: kolem obrazu svítí paprsky v rytmu hlasu (Web Audio), kreslí se jen během přehrávání
  d.querySelectorAll('[data-prehravac]').forEach(function (p) {
    var a = p.querySelector('audio'), cara = p.querySelector('.prubeh-cara'), ted = p.querySelector('[data-ted]'), popis = p.querySelector('[data-popis]');
    var cv = p.querySelector('.paprsky-hlas'), cx = cv && cv.getContext('2d'), an = null, data = null, raf = 0, W = 0, hl = [];
    var N = 150; for (var i = 0; i < N; i++) hl.push(0);
    function rozmer() { if (!cv) return; var r = cv.getBoundingClientRect(), q = Math.min(devicePixelRatio || 1, 2); W = Math.round(r.width * q); cv.width = cv.height = W; }
    function kresli(t, zive) {
      if (!cx || !W) return;
      cx.clearRect(0, 0, W, W);
      if (!zive) return;
      var c = W / 2, r0 = W * .395, barva = getComputedStyle(cv).color;
      cx.strokeStyle = barva; cx.lineCap = 'round';
      if (an) an.getByteFrequencyData(data);
      for (var i = 0; i < N; i++) {
        var u = i / N * Math.PI * 2 + t * .00004, cil;
        if (an) { var k = Math.floor((i < N / 2 ? i : N - i) / (N / 2) * data.length * .55) + 2; cil = data[k] / 255; }
        else cil = .18 + .12 * Math.sin(i * 1.7 + t * .0012) * Math.sin(i * .37 + t * .0007);
        hl[i] += (cil - hl[i]) * .22;
        var v = hl[i], L = W * (.02 + v * .09) * (.7 + .3 * Math.sin(i * 12.9898));
        cx.globalAlpha = .25 + v * .6; cx.lineWidth = W * (.002 + v * .004);
        cx.beginPath(); cx.moveTo(c + Math.cos(u) * r0, c + Math.sin(u) * r0); cx.lineTo(c + Math.cos(u) * (r0 + L), c + Math.sin(u) * (r0 + L)); cx.stroke();
      }
      cx.globalAlpha = 1;
    }
    function smycka(t) { if (a.paused) { raf = 0; kresli(0, false); return; } kresli(t, true); raf = requestAnimationFrame(smycka); }
    function analyzator() {
      if (an || klid) return;
      try {
        var AC = window.AudioContext || window.webkitAudioContext, ac = new AC(), src = ac.createMediaElementSource(a);
        an = ac.createAnalyser(); an.fftSize = 256; an.smoothingTimeConstant = .82; data = new Uint8Array(an.frequencyBinCount);
        src.connect(an); an.connect(ac.destination);
        a.addEventListener('play', function () { if (ac.state === 'suspended') ac.resume(); });
      } catch (e) { an = null; }
    }
    if (cv) { rozmer(); addEventListener('resize', rozmer); }
    function prepni() { analyzator(); if (a.paused) { a.play().catch(function () {}); } else { a.pause(); } }
    p.querySelectorAll('.prehrat, [data-hrat]').forEach(function (b) { b.addEventListener('click', prepni); });
    a.addEventListener('play', function () { p.classList.add('hraje'); popis.textContent = 'Pozastavit'; if (!raf && !klid) raf = requestAnimationFrame(smycka); });
    a.addEventListener('pause', function () { p.classList.remove('hraje'); kresli(0, false); popis.textContent = a.currentTime > 0 && !a.ended ? 'Pokračovat' : 'Přehrát ukázku'; });
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
