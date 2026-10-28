// Jóga mysli v4: menu + přepínač tří sluncí (bez smyček, bez scroll listenerů)
(function () {
  var d = document;
  var burger = d.querySelector('.burger'), menu = d.getElementById('menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var on = burger.getAttribute('aria-expanded') !== 'true';
      burger.setAttribute('aria-expanded', on); menu.classList.toggle('otevreno', on);
    });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') { burger.setAttribute('aria-expanded', 'false'); menu.classList.remove('otevreno'); } });
  }

  var b = d.querySelector('[data-slunce]');
  if (!b) return;
  var tituly = b.querySelectorAll('.b-h1'), obrazy = b.querySelectorAll('.b-obraz'), tlac = b.querySelectorAll('.b-prepinac button'),
      slunce = b.querySelector('.b-slunce'), i = 0, t;
  var klid = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // další dva obrazy se načtou až po prvním vykreslení (LCP zůstává jen u prvního)
  addEventListener('load', function () { setTimeout(function () { slunce.classList.add('pripraveno'); }, 1200); });
  function ukaz(n) {
    i = n;
    slunce.classList.add('pripraveno');
    tituly.forEach(function (h, k) { h.classList.toggle('on', k === n); h.setAttribute('aria-hidden', k === n ? 'false' : 'true'); });
    obrazy.forEach(function (o, k) { o.classList.toggle('on', k === n); });
    tlac.forEach(function (x, k) { x.setAttribute('aria-selected', k === n ? 'true' : 'false'); });
  }
  function dalsi() { t = setTimeout(function () { ukaz((i + 1) % tituly.length); dalsi(); }, 7000); }
  tlac.forEach(function (x, k) { x.addEventListener('click', function () { clearTimeout(t); ukaz(k); }); });
  if (!klid) dalsi();
})();
