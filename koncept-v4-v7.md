# Jóga mysli – koncept v4 (28. 10. 2026)

Předchozí verze: `koncept-v1.md`, `koncept-v2.md` a `koncept-v3.md` („Ze tmy do světla“).

## Proč v3 neprošla
Rafael: „strašný, děláš to horší a horší… musí být víc světlý a milionkrát lepší + obrázky se načítají moc pomalu.“
- **Šerá nálada.** Tmavá obloha v úvodu, noc u meditace a tmavá patička jdou přímo proti „Žijeme s lehkostí“ i proti VKUS.md
  (šerá tmavá nálada je mezi věcmi, které Rafael odmítá).
- **Tenké písmo v malých velikostech a hodně prázdna.** Nyght Light působil křehce, obrazovky byly z velké části prázdné.
- **Pomalé obrázky.** Malby měly 500 až 1 141 kB, WebP 1920 px i u miniatur. Miniatury v menu (3rem) tahaly celý srcset.
  WebGL zářič navíc čekal na texturu, než se něco ukázalo.

## Pevná pravidla v4 (pro všechny koncepty)
- **Barvy:** krém #fffaf2, písek #f6ecdc, pudr #f8e2d4, broskev #f9cba6, med #f4c46a. Text je tmavě hnědý #3f2c19
  (z brandu #513a1c). Jediný sytý akcent je terakotová oranž #cf530d (z brandu #f3690e, ztmavená kvůli kontrastu bílého písma).
  Žádná tmavá sekce.
- **Písmo:** Nyght Serif Regular 400 pro titulky (je to písmo jejího loga) a Albert Sans 400/600 pro text v 17 až 19 px.
  Žádné kurzívní barevné slovo a žádné verzálky přes celý řádek. Tlačítka jsou obdélná, ne pilulky.
- **Hrdina:** její kulaté svítící malby a ona sama na skutečné fotce u malby.
- **Pod hero hned prodej:** pět cest (služby) s obrazem a cenou „od“ a informativní konzultace zdarma.
- **Rychlost:**
  - build.py: varianty 320/480/640/960/1280/1600/1920 a malby nejvýš 1200 px.
  - Každý soubor nejvýš ~150 kB (kvalita se sama sníží, dokud se nevejde) a menší šířky úměrně méně (640 px ≈ 50 kB).
  - Každý obrázek má rozměry a barvu podkladu (průměrná barva fotky), takže se nic neskládá a nebliká bílá.
  - Hero je eager s fetchpriority=high, ostatní lazy. Žádné WebGL; pohyb jen v CSS (transform, opacity, clip-path).
  - Scroll je nativní a pohyb vázaný na scroll jde jen přes CSS `animation-timeline`.

---

## A – „Malba v zahradě“ (člověk + jeho řemeslo)
**Nápad:** Hlavní fotkou webu je skutečný záběr z jejího videa: Radana v rozkvetlé zahradě maluje velké bílo-zlaté slunce.
Pod fotkou vychází oblouk z jejích pěti kulatých obrazů a každý je jedna cesta (Akademie, procesy, meditace, retreaty, online)
s cenou nebo „ukázka zdarma“.
- **Proč jen Radana:** Jóga mysli a malování energetických obrazů jsou u ní jedna práce (sesterský web Obrazy z nitra).
  Žádná jiná lektorka jógy nemá pět vlastních obrazů, které můžou nést její služby, ani fotku, kde to slunce právě maluje.
- **Jak se projeví všude:**
  - **Hlavička:** bílá plovoucí lišta s logem vlevo a menu uprostřed. Vpravo je „Konzultace zdarma“ na pudrovém poli se slunečním
    znakem z loga (ne oranžová pilulka).
  - **Typografie:** centrovaný claim 96 px ve dvou řádcích a pod ním jedna věta.
  - **Fotky:** široké okno se zaoblením 28 px a teplým tónem. Fotky jsou zvětšené z videa (Real-ESRGAN ×2), lehce prosvětlené
    a do broskvova.
  - **Nabídka:** kulaté obrazy jako vstupy do služeb, na všech stránkách stejný jazyk. Podstránka služby otevře svůj obraz velký
    jako slunce v hero a vedle něj dá fotku z té služby.
  - **Pohyb:**
    - Fotka se odkryje z oblouku a obrazy vyjdou postupně jako slunce.
    - Každý obraz se pomalu otáčí (90 s).
    - Na plátně na fotce „dýchá“ světlo v rytmu nádech 4 s / výdech 6 s (soft-light vrstva, žádný canvas).
    - Ve fázi 2 může místo statické fotky běžet krátká smyčka z videa (načtená až po prvním vykreslení).
- **Nejbližší laťka:** Dermato `super/8064c99…`. Bere z něj centrovaný serifový claim na teplém podkladu, širokou zaoblenou fotku,
  oblouk ošetření na okraji fotky a dvě plovoucí karty (recenze + důvěra). U nás je ve kartách konzultace zdarma a skutečný citát Lucie, 37.
- **Test zaměnitelnosti:** Jiná lektorka jógy by neměla co dát do oblouku ani na fotku (stock jógy by koncept zabil).
  V `_prehled.png` nemá obdobu: žádný návrh neměl centrovaný claim nad fotkou s obloukem kruhů.

## B – „Tři slunce“ (obraz jako vycházející slunce)
**Nápad:** Nad obzorem stránky vychází její obraz jako slunce a mění se podle toho, s čím člověk přichází. Tři slunce jsou tři
claimy jejího současného webu: Klid, Uvolnění a Transformace, každý s jiným obrazem.
- **Proč jen Radana:** Logo „Žijeme s lehkostí“ má místo O slunce a její obrazy jsou zářiče (paprsky ze světlého středu).
  Tři claimy jsou její vlastní („Najděte svůj vnitřní klid“, „Uvolněte se od negativních myšlenek“, „Otevřete se celkové transformaci“).
- **Jak se projeví všude:**
  - **Hlavička:** logo vlevo, menu vpravo a hranaté terakotové tlačítko.
  - **Typografie:** jeden velký claim centrovaný na „nebi“.
  - **Kompozice:** kruh obrazu přes 3/4 šířky z poloviny pod obzorem. Scrollem stoupá (CSS scroll-timeline).
  - **Pod hero:** bílá rezervační lišta jako u restaurací („Kudy se vydat“ → 5 cest s cenou → konzultace zdarma).
  - **Podstránky:** každá má své slunce (obraz služby) nad obzorem, menší.
- **Nejbližší laťka:** Nest/Table `super/26f444f8…` (rezervační lišta pod hero, kulaté talíře = kulaté obrazy, rezavý akcent)
  a Santé `libi/6587927…` (teplé zlaté světlo).
- **Test zaměnitelnosti:** Slunce nad obzorem bez jejích obrazů by bylo obecné „wellness“. Funguje díky malbám a logu se sluncem.
  Slabina: obraz bez Radany, ona je jen malý štítek. Hrozí, že to bude spíš „galerie“ než „lektorka“.

## C – „Světlo z nitra“ (obraz jako světelné pole, Radana v jeho středu)
**Nápad:** Celá obrazovka je její bílo-zlatý obraz paprsků. V jeho středu, tam, kde malby mají své „nitro“, je kruh s Radanou
u stojanu. Z něj vedou tenké paprsky k pěti cestám s cenou.
- **Proč jen Radana:** Její obrazy jsou kompozičně vždy světlý střed a paprsky ven. Metafora jógy mysli „cesta do nitra“ je
  na webu doslova: obraz → střed → ona. Claim je její věta „Cesta do nitra k vnitřnímu klidu a lehkosti“.
- **Jak se projeví všude:**
  - **Hlavička:** logo vlevo a menu hned vedle něj. Konzultace zdarma je kulatá pečeť z obrazu s obíhajícím textem (žádné tlačítko v liště).
  - **Typografie:** obří titulek „Cesta do nitra“ (148 px) v levém dolním rohu, vedle něj pokračování věty.
  - **Paprsky:** jako popisky ze středu, stejně jako popisky technologií u Veridie.
  - **Podstránky:** každá má svůj obraz jako pole a ve středu fotku z té služby (sezení, Sahara, Havaj).
- **Nejbližší laťka:** Veridia `super/5d0f9b05…`. Bere z něj světlé rozostřené pole přes celou plochu, obří serif dole, tenké
  popisky s čarami od středu a kulatý odznak „Discover“. Druhou laťkou je Mindora `super/76ce629…` (obří slovo za postavou).
- **Test zaměnitelnosti:** Bez jejího obrazu paprsků a bez fotky u malby to nejde, protože pole by bylo jen béžový gradient.

---

## Výběr
**Vyhrála C „Světlo z nitra“** (koordinátor 28. 10.). Ze všech tří je nejvíc Radanina (její obraz, její střed, ona v něm)
a vedle Veridie obstojí. Varianty A/B/C jsou v `_varianty/v4/`.

**Opravy hero ve fázi 2:**
- Na PC je v hlavičce vpravo tlačítko „Konzultace zdarma“ v akcentu #cf530d. Pečeť zůstala jako doplněk u kruhu.
- Místo šesti drobných kartiček je pět velkých štítků (název 24 px serif, cena 15 px akcent). Leží klidně po obvodu, mimo hlavní paprsky.
- Kruh s Radanou je o 28 % větší (336 → 430 px). „Cesta do nitra“ má clamp(72px, 11.8vw, 190px) a perex 18 px.
- Na mobilu jsou štítky plné řádky: kulatý náhled obrazu, název, cena a šipka.

**Další obrazovky:**
- Hned pod hero je lišta z B (pět cest s cenou + konzultace zdarma), na PC i mobilu vidět už na první obrazovce.
- Fotka z A (Radana maluje v zahradě, `malba-zahrada.jpg`) je na úvodu v sekci „Dvě cesty“ a na O mně v sekci „Tak vznikají obrazy z nitra“.
- Celý web je světlý (krém, písek, pudr, broskev), žádná tmavá sekce.
- Podstránky přebírají hero C: obraz služby jako pole, ve středu fotka z té služby a čtyři štítky s cenou.

## Sekce → předloha (`~/rafadev-ops/reference/vkus/super/`)
| sekce | předloha | co bere |
|---|---|---|
| hero (pole + kruh + štítky) | Veridia `5d0f9b05…` | světlé pole, obří serif, popisky s čarami od středu |
| lišta pod hero | Nest/Table `26f444f8…` | bílý pruh s pěti položkami a cenou |
| vítejte | Dermato `8064c99f…` + Santé | velký serif text vedle portrétu, hodně vzduchu |
| dvě cesty (akademie / procesy) | Nest/Table / Rouge | dvě velké fotky s textem, střídání |
| obrazy (řada) | ARC Objects `bdc9a59f…` | obrazy jako předměty v řadě s popiskem |
| audiomeditace | Calmness `76ce629a…` | medová plocha, přehrávač s vlnou |
| místa / retreaty | Fieldnote PLACES | mřížka míst s velkými fotkami |
| slova klientů | Her glow | jedna velká citace na pudrovém poli |
| kontakt | Sóma | formulář vedle stoupajícího slunce |

## Měření hero variant (28. 10., Playwright headless, Fast 4G: 9 Mb/s, 60 ms, bez cache, lokální server)
| varianta | LCP 1440 | data 1440 | LCP 390 | data 390 | největší obrázek |
|---|---|---|---|---|---|
| A | 0,47 s | 348 kB | 0,34 s | 269 kB | 149 kB (fotka 1600 px) |
| B | 0,34 s | 235 kB | 0,33 s | 220 kB | 90 kB (obraz 960 px) |
| C | 0,32 s | 278 kB | 0,37 s | 249 kB | 116 kB (obraz 1200 px) |
Snímky a koláže: `_snimky/v4/`.
