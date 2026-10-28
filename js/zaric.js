/* Zářič – Radanin obraz jako živé slunce na obloze (WebGL1, bez knihoven).
   <div data-zaric data-paleta='{...}'> <div class="nebe-plakat"><img class="nebe-slunce-img"></div> <canvas></canvas> </div>
   Pozici a velikost slunce čte z plakátového <img> (CSS ji řídí i se scroll-driven animací), takže plakát i shader sedí na pixel.
   Kreslí jen když je canvas vidět; v klidu 30 fps, při scrollu 60 fps; na slabém stroji sníží rozlišení. Reduced motion = statický snímek. */
(function () {
  var els = document.querySelectorAll('[data-zaric]');
  if (!els.length) return;
  var klid = matchMedia('(prefers-reduced-motion: reduce)').matches;

  var VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  var FS = [
    'precision mediump float;',
    'uniform vec2 uRes;uniform float uT,uP,uRot,uFog,uBlend,uDust,uSc;uniform vec3 uSun;',
    'uniform sampler2D uTex;uniform vec3 uN0,uN1,uN2,uD0,uD1,uD2,uF0,uF1,uGlow;',
    'float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}',
    'float ns(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);',
    ' return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x),f.y);}',
    'float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<3;i++){v+=a*ns(p);p*=2.03;a*=.5;}return v;}',
    'void main(){',
    ' vec2 fc=gl_FragCoord.xy;float y=fc.y/uRes.y;float sx=fc.x/uRes.y;',
    ' vec3 nt=mix(uN2,uN1,smoothstep(.0,.5,y));nt=mix(nt,uN0,smoothstep(.42,1.,y));',
    ' vec3 dy=mix(uD2,uD1,smoothstep(.0,.5,y));dy=mix(dy,uD0,smoothstep(.42,1.,y));',
    ' vec3 col=mix(nt,dy,uP);',
    ' float hz=fbm(vec2(sx*1.4+uT*.011,y*2.6-uT*.005));col*=.955+.09*hz;',
    // slunce
    ' vec2 d=fc-uSun.xy;float R=max(uSun.z,1.);float r=length(d)/R;float a=atan(d.y,d.x);',
    ' float cy=mod(uT,10.);float br=cy<4.?smoothstep(0.,4.,cy):1.-smoothstep(4.,10.,cy);',
    ' vec3 gl=uGlow;float gi=(.62+.3*br)*(1.-.6*uP);',
    ' float halo=exp(-max(r-.55,0.)*2.1);',
    ' float ang=a+uRot*.35;',
    ' float ry=ns(vec2(ang*7.,uT*.12))*.55+ns(vec2(ang*19.+3.,-uT*.2))*.45;ry=pow(ry,2.4);',
    ' float rf=exp(-max(r-.9,0.)*.75)*smoothstep(.7,1.1,r);',
    ' float vn=mix(1.,smoothstep(.55,1.05,r),uBlend*.75);',
    ' col+=gl*(halo*.42*vn+ry*rf*1.05)*gi;',
    ' float rr=r/(1.+.022*br);',
    ' float sh=(ns(vec2(a*34.,uT*.55))-.5)*.03*smoothstep(.5,1.,rr);',
    ' float rs=rr+sh;float ca=a+uRot;',
    ' vec2 uv=.5+.5*uSc*rs*vec2(cos(ca),sin(ca));',
    ' vec3 pt=texture2D(uTex,vec2(uv.x,1.-uv.y)).rgb;',
    ' pt*=1.+.16*br*(1.-smoothstep(0.,.4,rr));',
    ' float w=2./R;',
    ' float disc=1.-smoothstep(1.-w,1.+w,rs);',
    ' float soft=1.-smoothstep(.72,1.,rs);',
    ' vec3 scr=1.-(1.-col)*(1.-pt*soft);',
    ' vec3 nor=mix(col,pt,disc);',
    ' col=mix(nor,scr,uBlend);',
    ' col+=gl*.35*exp(-abs(rs-1.)*R/5.)*(1.-uBlend)*gi;',
    // mlha
    ' float fe=uFog+.06*(fbm(vec2(sx*1.8+uT*.018,uT*.01+3.))-.5);',
    ' float fg=smoothstep(fe+.16,fe-.08,y);',
    ' vec3 fcol=mix(uF0,uF1,uP);fcol=mix(fcol,uD2,smoothstep(fe*.7,0.,y));',
    ' col=mix(col,fcol,fg);',
    ' col+=gl*.3*fg*exp(-abs(fc.x-uSun.x)/(R*1.5))*(1.-uP*.7)*smoothstep(-.02,fe,y);',
    // zlaté částečky
    ' if(uDust>0.){',
    '  float nearS=.35+exp(-length(d)/(R*2.2));',
    '  for(int i=0;i<2;i++){float fi=float(i);',
    '   vec2 g=vec2(sx,y)*(18.+fi*13.);g.y-=uT*(.18+fi*.1);g.x+=sin(g.y*.35+fi)*.25;',
    '   vec2 id=floor(g);vec2 f=fract(g)-.5;float h=h21(id+fi*17.);',
    '   vec2 o=(vec2(h21(id+3.1),h21(id+7.7))-.5)*.7;',
    '   float tw=.55+.45*sin(uT*(.8+h*1.6)+h*6.28);',
    '   float s=smoothstep(.075,0.,length(f-o))*step(.8,h)*tw;',
    '   col+=vec3(1.,.86,.62)*s*.85*nearS*(1.-uP*.75)*(1.-fg)*uDust;}',
    ' }',
    ' col+=(h21(fc+uT)-.5)/255.;',
    ' gl_FragColor=vec4(col,1.);',
    '}'
  ].join('\n');

  function rgb(h) { h = h.replace('#', ''); return [parseInt(h.slice(0, 2), 16) / 255, parseInt(h.slice(2, 4), 16) / 255, parseInt(h.slice(4, 6), 16) / 255]; }

  els.forEach(function (el) {
    var cv = el.querySelector('canvas'), img = el.querySelector('.nebe-slunce-img');
    if (!cv || !img) return;
    var pal; try { pal = JSON.parse(el.getAttribute('data-paleta')); } catch (e) { return; }
    var gl = cv.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power', preserveDrawingBuffer: false });
    if (!gl) return;

    function sh(t, s) { var o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(o)); return null; } return o; }
    var vs = sh(gl.VERTEX_SHADER, VS), fs = sh(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return;
    var pr = gl.createProgram(); gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
    gl.useProgram(pr);
    var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var U = {};
    ['uRes', 'uT', 'uP', 'uRot', 'uFog', 'uBlend', 'uDust', 'uSc', 'uSun', 'uTex', 'uN0', 'uN1', 'uN2', 'uD0', 'uD1', 'uD2', 'uF0', 'uF1', 'uGlow'].forEach(function (n) { U[n] = gl.getUniformLocation(pr, n); });
    var n = pal.n, dd = pal.d, f = pal.f;
    gl.uniform3fv(U.uN0, rgb(n[0])); gl.uniform3fv(U.uN1, rgb(n[1])); gl.uniform3fv(U.uN2, rgb(n[2]));
    gl.uniform3fv(U.uD0, rgb(dd[0])); gl.uniform3fv(U.uD1, rgb(dd[1])); gl.uniform3fv(U.uD2, rgb(dd[2]));
    gl.uniform3fv(U.uF0, rgb(f[0])); gl.uniform3fv(U.uF1, rgb(f[1])); gl.uniform3fv(U.uGlow, rgb(pal.g));
    gl.uniform1f(U.uFog, pal.mlha == null ? .2 : pal.mlha);
    gl.uniform1f(U.uBlend, pal.svetlo ? 1 : 0);
    gl.uniform1f(U.uDust, pal.prach ? 1 : 0);
    gl.uniform1f(U.uSc, pal.orez || .97);
    gl.uniform1i(U.uTex, 0);
    var p0 = pal.p0 || 0, p1 = pal.p1 == null ? 1 : pal.p1, rotRych = pal.rot == null ? .02 : pal.rot;

    var pripraveno = false, vidim = false, kvalita = innerWidth < 700 ? .85 : 1, posledni = 0, scrollT = 0, t0 = performance.now(), raf = 0;
    var deltas = [], snizeno = 0;

    function textura() {
      var N = 1024, c = document.createElement('canvas'); c.width = c.height = N;
      var x = c.getContext('2d'); x.drawImage(img, 0, 0, N, N);
      var t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, c);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      pripraveno = true;
      velikost(); kresli(performance.now());
      el.classList.add('gl-on');
      if (!klid) smycka();
    }
    var sirka = 0, vyska = 0, dpr = 1;
    function velikost() {
      var r = cv.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.5) * kvalita;
      var w = Math.max(1, Math.round(r.width * dpr)), h = Math.max(1, Math.round(r.height * dpr));
      if (w !== sirka || h !== vyska) { cv.width = sirka = w; cv.height = vyska = h; gl.viewport(0, 0, w, h); }
    }
    function kresli(now) {
      var rc = cv.getBoundingClientRect(), ri = img.getBoundingClientRect();
      var cx = (ri.left + ri.width / 2 - rc.left) * dpr, cy = (rc.bottom - (ri.top + ri.height / 2)) * dpr, rad = ri.width / 2 * dpr;
      var prog = Math.min(1, Math.max(0, -rc.top / (rc.height * .8)));
      var t = klid ? 3 : (now - t0) / 1000;
      gl.uniform2f(U.uRes, sirka, vyska);
      gl.uniform1f(U.uT, t);
      gl.uniform1f(U.uP, p0 + (p1 - p0) * prog);
      gl.uniform1f(U.uRot, t * rotRych);
      gl.uniform3f(U.uSun, cx, cy, rad);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    function smycka() {
      if (raf || !vidim || document.hidden) return;
      raf = requestAnimationFrame(function tik(now) {
        raf = 0;
        if (!vidim || document.hidden) return;
        var dt = now - posledni, rychle = now - scrollT < 400;
        if (rychle || dt > 31) {
          if (posledni && dt < 100) {
            deltas.push(dt);
            if (deltas.length > 40) {
              var avg = deltas.reduce(function (a, b) { return a + b; }) / deltas.length; deltas = [];
              var cil = rychle ? 22 : 40;
              if (avg > cil && kvalita > .55 && snizeno < 4) { kvalita -= .12; snizeno++; velikost(); }
            }
          }
          posledni = now; kresli(now);
        }
        raf = requestAnimationFrame(tik);
      });
    }
    new IntersectionObserver(function (e) {
      vidim = e[0].isIntersecting;
      if (vidim && pripraveno) { if (klid) kresli(performance.now()); else smycka(); }
    }, { rootMargin: '100px' }).observe(cv);
    addEventListener('scroll', function () { scrollT = performance.now(); if (klid && vidim && pripraveno) kresli(scrollT); }, { passive: true });
    addEventListener('resize', function () { if (pripraveno) { velikost(); kresli(performance.now()); } });
    document.addEventListener('visibilitychange', function () { if (!document.hidden) smycka(); });
    cv.addEventListener('webglcontextlost', function (e) { e.preventDefault(); el.classList.remove('gl-on'); pripraveno = false; });

    function start() { if (img.decode) img.decode().then(textura, textura); else textura(); }
    if (img.complete && img.naturalWidth) start(); else img.addEventListener('load', start, { once: true });
  });
})();
