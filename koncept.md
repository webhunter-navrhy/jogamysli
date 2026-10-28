# Jóga mysli – koncept v3 „Ze tmy do světla“ (28. 10. 2026)

Předchozí verze: `koncept-v1.md` (editoriál, „šablonový“), `koncept-v2.md` („Zářič“, Rafael: „pořád nic moc, měl by být mnohem lepší“).

## Proč v2 neprošla (upřímně)
- **Hero je koláž, ne obraz.** Výřez Radany s roztřepenými vlasy přilepený přes polokruh obrazu useknutý vodorovnou čarou
  a CSS „paprsky“ jako z Canvy. Kolem pět drobných prvků (pečeť, přehrávač, dva sloupce textu, pruh). Oko nemá kam spočinout.
- **Obrazy jsou jen kulaté fotky.** Radaniny malby svítí: mají světlý střed, paprsky, třpyt. Ve v2 to byly ploché kruhové obrázky
  s pomalou rotací. Žádné světlo, žádná hloubka.
- **Pod hero průměr žánru.** Krémová plocha, text vlevo, pět stejných kruhů vedle sebe, citáty textem, formulář v kartě.
  Rytmus sekcí se nemění, nic nepřekvapí. Malé verzálkové štítky všude.
- **Pohyb je skoro neviditelný** (rotace 180 s). Klientka chtěla animace, které jsou vidět a něco znamenají.
- Review dalo 8/10, protože hodnotilo „bez chyb“, ne „úroveň špičky žánru“. Vedle wellness webů ze Site of the Day by v2 působila levně.

## Tři koncepty
1. **„Ze tmy do světla“ (vybráno).** Jeden z Radaniných obrazů se jmenuje „Ze tmy do světla“ a celá jóga mysli je cesta od tlaku
   a úzkosti k lehkosti. Web je jeden den: úvod začíná za šera, Radanin obraz vychází jako živé slunce (WebGL: obraz svítí, paprsky
   se chvějí, střed dýchá v rytmu nádech 4 s / výdech 6 s, stoupají zlaté částečky) a scrollem se obloha rozednívá do krémového dne.
   Uprostřed webu je noc meditace (obraz „O dobru“ svítí v rytmu jejího hlasu), na konci obraz zapadá za obzor u kontaktu
   a patička je noc.
2. **„Galaxie zářičů“.** Celý úvod jako noční obloha plná jejích obrazů v různé hloubce, scroll = let mezi nimi. Silné, ale celý
   tmavý a abstraktní, jóga a Radana se v tom ztratí; tmavý web pro wellness je proti brandu (krém, hnědá).
3. **„Dech“.** Web řízený dechem (obrazy a text se nadechují a vydechují). Krásné jako detail, slabé jako celek: dech má každé studio.
   Bereme z něj rytmus 4/6 s pro dýchání slunce.

## Proč 1
- Je postavená na tom, co nemá nikdo jiný: její svítící malby, název jejího obrazu a její slib (z tlaku do lehkosti).
- Drama dává kontrast šero → den, ne efekt pro efekt. Tmavé jsou jen začátek úvodu, meditace a patička, zbytek je světlý brand.
- Není to tmavá + zlatá „luxus“: šero je teplá švestkově-hnědá obloha, zlato jen ze samotných obrazů.
- Test zaměnitelnosti: bez jejích obrazů a bez názvu „Ze tmy do světla“ by koncept nefungoval.

## Skladba úvodu (obsah a pořadí jako v2/originál)
1. **Svítání (signature 1).** Celá obrazovka: WebGL obloha za šera, obraz-slunce vychází zpoza mlhy, obří nadpis „Cesta do nitra
   k vnitřnímu klidu a lehkosti“ ve světlém Nyght přes oblohu. V mlze dole perex + konzultace zdarma a malý přehrávač ukázky.
   Scrollem slunce stoupá a obloha se rozední do krému další sekce.
2. **Vítejte.** Velká fotka Radany u stojanu s obrazem (rám ve tvaru vycházejícího slunce, odkrývá se scrollem) + věta „Jmenuji se…“,
   která se slovo po slovu rozsvěcuje, text, citát.
3. **Kudy se můžeme vydat.** Vlevo lepkavý (sticky) velký obraz, který se při scrollu mění podle služby (5 obrazů, točí se, světlo
   kolem má barvu obrazu, celé pozadí sekce se jemně přebarví). Vpravo pět služeb velkým písmem. Na mobilu obraz u každé služby
   zasahující přes okraj.
4. **Noc meditace (signature 2).** Tmavá sekce: obraz „O dobru“ s paprsky světla, které při přehrávání reagují na Radanin hlas
   (Web Audio analyzer, kreslení jen během přehrávání). Video o józe mysli.
5. **Souhvězdí obrazů.** Obrazy z Obrazů z nitra rozházené v hloubce kolem nadpisu, každý jinou rychlostí paralaxy (CSS view-timeline),
   pomalu se točí, po najetí popisek. Odkazy na obrazy-z-nitra.cz.
6. **Kdo už prošel touto cestou.** Jeden velký citát + dva menší, světlo obrazu za nimi.
7. **Západ.** Kontakt na večerní obloze, obraz zapadá do mlhy (druhá instance WebGL), formulář jako krémový list. Patička = noc.

**Podstránky:** stejné nebe, ale ranní (světlé), s obrazem služby jako sluncem vpravo dole, velký nadpis vlevo.

## Písmo, barvy, foto
- Nyght Serif Light (písmo jejího webu a loga) v obřím měřítku, Albert Sans 300–500. Háčky otestované (v1).
- Paleta z brandu: krém #fffbf3, písek #f6efe2, hnědá #73614c, tmavě hnědá #513a1c, zlatá #c6975d. Šero: #2a1c22 → #6b3b3c → #d98b5a
  (teplá hnědo-švestková, navazuje na hnědou brandu).
- Jen její fotky a malby. Žádné výřezy postavy (ve v2 působily lacině).

## Technika a pohyb
- WebGL1 shader bez knihoven (~6 kB): obloha, mlha, obraz jako textura (rotace, chvění paprsků, dýchání), záře, god rays, částečky.
  Kreslí jen když je canvas vidět, ve 30 fps v klidu a 60 fps při scrollu, rozlišení se samo sníží na slabém stroji.
  Pod canvasem je statický plakát (CSS obloha + obraz), takže LCP je hned a bez WebGL/při reduced motion vše funguje.
- Zbytek: nativní scroll, CSS `animation-timeline` (paralaxa, odkrytí fotky, rozsvěcení slov), IntersectionObserver. Bez Lenis/GSAP.

## Zakázané vzory
- Částečky (zlatý prach) jsou blízko „zrnu“: jsou součástí světla obrazu, jen v hero, ne přes stránku.
- Nekonečná animace slunce: je to obsah (dýchání 4/6 s), běží jen když je vidět.
- Žádný marquee, statistiky, 01/02/03, pilulková navigace, polaroidy.

## Porovnání
- Schválené: Gančar (obraz jako světlo), Kling (motiv z oboru řízený scrollem). Odmítnuté: tmavá + zlatá (tady ne, šero je obloha),
  intro animace (žádná, obsah je vidět hned), prázdné sekce (žádné).
- Poslední weby v registru: jiný display font (Nyght je brand klientky) i skladba.
