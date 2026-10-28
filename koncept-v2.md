# Jóga mysli – koncept v2 (28. 10. 2026)

**Proč v2:** Rafael 28. 10.: v1 je „moc jednoduchá, moc obyčejná, moc šablonová, klientku nezaujme“.
V1 byl korektní editoriál (text vlevo + obraz vpravo, řádkové seznamy, karty, menu vpravo + pilulka) a neměl nápad, který by
patřil jen Radaně. Původní koncept v1 je v `koncept-v1.md`.

**Hrdina webu:** Radaniny energetické obrazy. Jsou kulaté a paprskovité jako slunce, mají soustředné kruhy a ve středu světlo.
Ona sama jim říká „energetické zářiče“. Žádný jiný lektor jógy je nemá. Druhý hrdina je Radana: má výrazný vzhled
(platinové vlasy) a vlastní fotky z ateliéru, z praxe a z retreatů. Výřezy: `img/vyrez/radana-stojan.png` (u stojanu)
a `radana-portret.png` (zahrada).

Laťka: pin `super/76ce629a…` (Mindora „Calmness“: obří slovo za postavou, plovoucí karty, teplé světlo),
TOP web charleston (umění domu jako textura značky, obří písmena přes malbu), yam (reálný člověk místo modelky).

---

## A) „Zářič“: obraz vychází jako slunce nad obzorem
**Nápad:** každá stránka má svůj obraz-slunce, které vychází nad teplým obzorem. Radana jim říká zářiče, mají paprsky a světlý střed,
a „Žijeme s lehkostí“ má v logu slunce místo „o“. Celý web je jedno svítání.
- **Hero:** obloha od krémové po medovou (svítání). Obří slovo „lehkost“ ve fontu Nyght přes celou šířku. Za ním vychází zlatý obraz
  a při scrollu stoupá a pomalu se točí. Radana (výřez u stojanu) stojí před slovem a písmena překrývá jako postava na pinu
  Mindora. Kolem plují dvě karty: přehrávač ukázky meditace a „Informativní konzultace zdarma“. Kulatá pečeť
  „Obrazy z nitra“ s textem do kruhu vede na sesterský web.
- **Hlavička:** logo vlevo (slunce v „lehkosti“). Menu je tenké uprostřed. Vpravo je odkaz se sluníčkem, který se točí při najetí. Pilulka tam není.
- **Typografie:** Nyght Light v obřím měřítku (až 22vw), řádkování 0,85. Text v Albert Sans.
- **Podstránky:** každá služba má hero se svým obrazem, který vychází nad obzorem stejně jako na úvodu, s obřím slovem
  („Akademie“, „Procesy“, „Retreaty“). Barvu oblohy určuje obraz: zlatá, oranžová, krémová.
- **Pohyb:** CSS `animation-timeline: scroll()` (slunce stoupá, paprsky se rozvírají) a pomalá rotace obrazu.
- **Test zaměnitelnosti:** u jiné lektorky jógy nefunguje, protože ta nemá kulaté zářiče a slunce v logu. Stockový obrázek slunce by byl kýč.
  Funguje proto, že jsou to její skutečné malby.

## B) „Do středu“: web jako cesta po kruzích do nitra
**Nápad:** obrazy mají soustředné kruhy, které vedou do světlého středu, a Radanina metoda se jmenuje „cesta do nitra“. Web je
mapa kruhů. Úvod ukazuje pět cest jako oběžnice kolem středu. Scrollem se jde dovnitř.
- **Hero:** uprostřed velký obraz se soustřednými kruhy. Nadpis běží po kružnici kolem něj a pomalu se otáčí. Na vnější dráze
  obíhá pět malých obrazů služeb s popisky (Akademie, Procesy, Meditace, Retreaty, Online kurz), každý vede na svou podstránku.
  Při scrollu se obraz přibližuje a jeho světlý střed se otevře do další sekce („ticho nitra“).
- **Hlavička:** logo vlevo. Menu jako svislý rejstřík vpravo s malými kroužky (aktivní kroužek je plný).
- **Podstránky:** hero je výřez kruhu a stránka „sedí“ na své dráze. Na ní jsou malé značky ostatních cest pro přechod jinam.
- **Test zaměnitelnosti:** kruhy obecně jsou wellness klišé. Silné je to jen díky jejím obrazům. Hrozí „design pro designéry“
  (obíhající navigace) a hůř se čte na mobilu.

## C) „Dech“: obraz, který dýchá s vámi
**Nápad:** jóga mysli začíná dechem. Hero je dechové cvičení: Radanina tvář v kruhu z obrazu, který se nadechuje (4 s) a vydechuje (6 s).
Slova „nádech“ a „výdech“ se střídají v obřím písmu.
- **Hero:** vlevo nahoře obří „nádech“, vpravo dole „výdech“. Uprostřed portrét Radany v kruhovém rámu z obrazu (paprsky kolem
  tváře), rám dýchá. Plovoucí karta: „Zkuste to teď: 4 s nádech, 6 s výdech“.
- **Podstránky:** v hlavičce malý dechový kruh, sekce se odkrývají v rytmu výdechu.
- **Test zaměnitelnosti:** dech jako téma má každé jógové studio. Odlišuje ho jen obraz a portrét, takže je nejslabší.

---

## Výběr
Všechny tři varianty hero jsou postavené (`_varianty/hero-a|b|c.html`).

**Vyhrála A „Zářič“.**
- Jako jediná má Radanu i její obraz najednou. Vedle pinu Mindora nevypadá levněji, protože obří slovo, postava přes písmo, plovoucí karty a teplé světlo tvoří jeden nápad.
- B je krásná, ale abstraktní: chybí člověk, je to „design pro designéry“ a na mobilu se oběžnice rozpadají. Její motiv oběžné dráhy jsem přenesla do A jako „kolo zářičů“ v sekci Obrazy z nitra.
- C se dá zaměnit: dech má každé studio.

**Jak A prochází webem**
- **Hlavička:** logo vlevo, tenké menu uprostřed a vpravo odkaz se sluníčkem. Po odscrollování se z ní stane krémový pruh.
- **Úvod:**
  1. Svítání (hero).
  2. Představení Radany obří větou, ve které jsou malé kulaté fotky. Při scrollu se postupně „rozsvěcuje“.
  3. Pět cest jako pět sluncí nad jedním obzorem. Při scrollu postupně vycházejí a vedou na podstránky.
  4. Meditace jako deska: obraz se při přehrávání točí a kolem běží prsten průběhu. Vedle je video.
  5. Kolo zářičů: obrazy na velké kružnici, která se scrollem otáčí. Odkazy vedou na obrazy-z-nitra.cz.
  6. Slova klientů.
  7. Konzultace zdarma (formulář) jako západ slunce: obraz zapadá za obzor.
- **Podstránky:** hero má stejný obzor a vlastní obraz služby (Akademie zlatý, Procesy medový, Meditace oranžový, Retreaty bílý, Online kurz rudý). Obří slovo je název služby a vedle stojí fotka z praxe jako plovoucí karta. Ceníky jsou sázené jako tištěný lístek, FAQ je rozbalovací.
- **Pohyb:** jen CSS scroll-driven (`animation-timeline: scroll()/view()`) a IntersectionObserver. Pomalá rotace obrazů se mimo obrazovku pozastaví. Respektuje se `prefers-reduced-motion`. Nepoužívám Lenis ani GSAP.
- **Signature moment:** svítání v hero a kolo zářičů. Obojí tvoří Radaniny skutečné obrazy.
