# Sector 2026 – co se změnilo oproti původní stránce

Zdroj: https://cz.author.eu/sector-29-2026-ua42968602 (stáhnuto 2026-11-17).

**Verze 1.0** (2026-11-23): první ucelená verze nového designu detailu produktu. Další verze se budou číslovat a vydávat na GitHubu (https://github.com/Zajic70/a27-detail/releases).

## Struktura složky

| Cesta | Co to je |
|---|---|
| `index.html` | stránka (lokální kopie originálu + 2 řádky pro nový design) |
| `system/`, `data/` | stažené originální CSS, JS, fonty, obrázky (beze změny) |
| `new/new.css` | **nový design** – všechna pravidla pod `html[data-design="new"]` |
| `new/new.js` | **nový design** – galerie, popis v modálním okně, piktogramy (vanilla JS, bez závislostí; dočasný přepínač viz sekce Dočasné prvky) |
| `_orig/page.html` | čistý originál stažený ze serveru (nic neupraveno) |
| `_orig/index_lokalni_kopie.html` | originál s opravenými cestami, ještě bez nového designu |

## Změny v `index.html` oproti originálu

1. **Odstraněno** `<base href="https://cz.author.eu/" />` (jinak by se vše načítalo ze živého webu).
2. Cesty k CSS/JS/fontům/obrázkům (včetně `srcset`) přepsány na lokální relativní (`system/…`, `data/…`).
3. Ostatní relativní odkazy (`href="a-ray-2-0-…"`) změněny na absolutní `https://cz.author.eu/…`, ať nejsou rozbité.
4. **Přidány 2 řádky** v `<head>` (před `cookie_cs.css`):
   ```html
   <link href="new/new.css" rel="stylesheet" type="text/css" />
   <script src="new/new.js"></script>
   ```
5. **Přidáno `loading="lazy"`** k 22 obrázkům původní galerie (velké fotky a náhledy ve slideru). V novém designu je původní galerie skrytá, takže se její fotky vůbec nestahují (dřív se stáhlo 39 obrázků, 8,3 MB; teď 19 obrázků, 1,9 MB). V původním designu se fotky dotahují podle potřeby.

Žádná jiná úprava HTML značek. Původní galerie (Slick) zůstává v DOM, v novém designu je jen skrytá.

Diff proti originálu: `diff _orig/index_lokalni_kopie.html index.html` (2 řádky nového designu + dočasné úpravy popsané v sekci Dočasné prvky). Složka `_orig/` je jen lokálně, do repozitáře se nenahrává.

## Co dělá nový design

Vše platí na počítači i na mobilu, pokud není uvedeno jinak. Původní design zůstává beze změny (jde přepnout přepínačem).

### Horní část: název, barvy, cena
- **Barevné varianty** (`.lypi-barva`): bez popisku „Barevné varianty“, vedle barevného vzorku je **název barvy** (např. „zelenozlatá-matná / černá“; bere se z atributu `title` vzorku, u více barev název vybrané; `buildColorName()` v JS).
- **Cena** (`.k-cena`): cenový blok je **přesunutý nahoru, hned pod název a barevné varianty**, před dlouhý výčet předností s fajfkami (`placePrice()` v JS; v původním designu zůstává na původním místě za výčtem). Je zarovnaný vpravo: nahoře původní cena, pod ní tlačítko KOUPIT TEĎ a těsně za ním (úplně vpravo) šedé pole s akční cenou. Vzhled prvků zůstává původní.
- **Vaše velikost / K porovnání / Doplňky**: tři šedá, stejně široká tlačítka hned pod cenou, v tomto pořadí a s těmito krátkými texty (původní „Přidat k porovnání“ a „Doplňková výbava“ jsou kratší, aby se vešly i na mobil). Nové tlačítko **Vaše velikost** otevře záložku „Geometrie a velikosti“ (na mobilu rozbalí stejnojmennou sekci), stejně jako Doplňky otevírají doplňkovou výbavu. Po kliknutí se stránka posune s odsazením pod hlavičku webu, aby byl vidět nadpis sekce i první řádek. Tlačítka vytváří JS a klik předávají původním odkazům (originál `.k-mp-lmenu` je v novém designu skrytý).

### Galerie
- Velká fotka (4:3) s jednoduchými šipkami (jen chevron), swipem prstem i myší. Pod ní **jedna řada náhledů bez posuvníku** (posun prstem / tažením myši), aktivní náhled má **oranžové podtržení** (#F29400). Šipky leží přes levý a pravý okraj řady, fotky pod nimi prosvítají (šipka je vidět jen tam, kam se dá řada posunout). Video je v řadě jako náhled s ikonou play.
- Pod řadou uprostřed **počet fotek a videí** v podobě původní ikony videa z pravého sloupce: číslo a za ním ikona 19 px (fotky `new/ico_image.svg`, videa původní `system/img/ico_camera.svg`); klik skočí na první fotku / video. Původní ikona videa vpravo (`.lypi-naviico .kni-video`) je skrytá, celý řádek jen pokud v něm není nic jiného (např. 3D model).
- Klik na fotku otevře **lightbox se všemi fotkami (a videem) pod sebou**: scrolluje se, klepnutí/klik fotku zvětší (220 %), na mobilu jde i štípnutí; křížek (na oranžovém kruhu, aby byl vidět i nad bílou fotkou) nebo Esc zavře.
- **Rychlé načtení**: první fotka se zobrazí hned, zbytek se dotahuje později (viz sekce Pro programátora).

### Popis
- Nadpis **Popis** (šedý pruh s oranžovým proužkem vlevo, `.ng-h`) a pod ním sbalený text (`.lypi-perex`) s větším písmem (1,05 rem, tučné 1 rem, výška ~10 rem) a přechodem do bílé.
- Tlačítko **Více…** (šedý text se šipkou) otevře **modální okno** (stejné řešení jako na Alze) s větším písmem: okno se otevře rovnou na podrobném textu, nad ním je velká fotka, název, úvod (první 2 bloky textu dělené dvojitým `<br>`) a znovu hlavní přednosti (kopie `.lypi-hdl`). Zavření: křížek, klik mimo, Esc (`buildModal()` v JS).

### Piktogramy
- **Nad nadpisem Popis** (pod výčtem předností) malý jemně šedý blok „odjinud“ (pozadí #f6f6f6) s nadpisem „Novinky, návody, akce a tipy“ drobným šedým písmem na středu a pěti ikonami: **VIP Bikes** (popisek „Author’s Heroes“), **Facebook**, **Instagram**, **YouTube**, **Newsletter** (`.ng-soc`, `buildSocial()`).
- Aplikační ikony 28 px se zaobleným čtvercem a barevným přechodem; VIP Bikes je dodané logo VIP BIKES (obrázek `new/vip-bikes.png`, 256 × 256 px, průhledné rohy), každá ikona má v rohu malý červený ovál Author (`new/author_oval.png`, vyříznutý z původního loga bez nápisu).
- Odkazy v testovací kopii vedou na `#`, skutečné cíle jsou v atributu `data-url`: VIP Bikes https://hero.author.eu/, https://www.facebook.com/Author.cz/?locale=cs_CZ, https://www.instagram.com/authorbicycles/, https://www.youtube.com/@authoradmin; **adresa Newsletteru zatím není doplněná** (`data-url` je prázdné). Při nasazení dát `data-url` do `href`.

### Ostatní modely
- Celý blok (nadpis, seznam, tlačítko) je vystředěný v pravém sloupci. Vidět jsou **4 modely celé** (žádný z nich není pod bílým přechodem) a pátý jako mizející náznak, v nadpisu počet (např. „ostatní modely (10)“). Tlačítko **Více…** leží přes ten bílý přechod, po rozbalení je pod seznamem jako „Méně…“ (obal `.ng-models-wrap`, `buildModels()` v JS). Nadpis je šedý pruh s oranžovým proužkem jako „Popis“.

### Jiný modelový rok
- Na mobilu (do 840 px) rozbalovací tmavý pruh se šipkou jako záložky specifikace, roky jsou výchozí sbalené, písmo stejné jako u záložek (`.lyp-time .timeline`, `buildYears()`). Na počítači beze změny.

### Kde koupit – seznam dealerů (`#kb-dostupnost`, jen CSS a `buildDealers()`)
- U dealera s proklikem na web se ukáže jen **město, web (tlačítko) a mapa**; telefon a e-mail jsou schované, zájemce je najde na webu dealera (stejný princip jako na ketaj.cz). Dealeři bez webu mají kontakt dál. Na mobilu se kontakt schová úplně.
- **Nadpisy sloupců tabulky** (Barevná varianta, Velikost, Dostupnost, Nákup, Město, Kontakt na prodejce, Kód modelu) se nezobrazují vůbec, na počítači ani na mobilu.
- Původní informace s košíkem ve sloupci Dostupnost je nahrazená krátkým **stavem před tlačítky**: „Skladem“ (zeleně) nebo „Na objednání“ (`buildDealers()`).
- **Pevné sloupce:** stav, tlačítka a město jsou ve stejných sloupcích i u dealera bez WEBu (na jeho místě je prázdné místo, MAPA se neposouvá).
- V řádku dealera jsou vedle sebe tři tlačítka: **OBJEDNAT TEĎ / KOUPIT TEĎ** (barvy původní: oranžové objednat, červené koupit, obě stejně široká, 118 px), **WEB** (hlavní adresa dealera, odvozená z adresy jeho e-shopu) a **MAPA** (otevře původní mapu), obě šedá a stejně široká (64 px). Dealer bez webu (Pavel Brabec) má jen koupit a mapu.
- **Řádek varianty** (nadpis každé velikosti) má pořadí: vzorek barvy, **červená velikost**, název s objednacím číslem (např. „Sector 2026 zelenozlatá-matná / černá 17″  UA#42968602“) a až pak počet prodejen (`buildVariantRows()`). Celý řádek je na **jednotném světle šedém podkladu**.
- **Velikost písma** v řádku dealera je jednotná, 14 px: název firmy, tlačítka (objednat/koupit, web, mapa, objednat jinde) i město. Název firmy má stejné písmo jako tlačítka (`fontTeuB`, skutečné tučné), aby nebyl opticky větší než text na tlačítkách.
- Na počítači jsou **tlačítka a město hned za názvem pobočky** (název má pevnou šířku, bez prázdného sloupce Dostupnost). Na mobilu nejsou mezi řádky dealerů tečkované čáry.
- Název firmy je v lehce šedém poli, **zarovnaný vlevo** (bez odrážky), na společné levé hraně.
- **Mobil:** stav je na vlastním řádku nad tlačítky, tlačítka mají dotykovou výšku 44 px s mezerou 8 px a tabulka nepřetéká přes šířku okna (žádný vodorovný posuvník). Velikost kola (17", 19", 20,5") u každé varianty je **červeně**.
- Řádek „Na ostatních prodejnách“ vypadá jako ostatní: šedé pole s textem na úrovni názvů firem a vedle něj (kde jsou u ostatních tlačítka) tmavé tlačítko **OBJEDNAT JINDE**, stejně široké; klik jde původnímu odkazu „dealeři“.
- Celý seznam dealerů je na počítači **vystředěný** na stránce. Po sbalení a opětovném rozbalení varianty (šipka vlevo) zůstává rozložení řádků beze změny (původní skript je zobrazuje inline `display: table-row`, proto je v CSS `display: flex !important` pro takto zobrazené řádky).
- Všechny údaje a hlavičky v tabulce jsou zarovnané vlevo a tabulka je jen tak široká, jak je potřeba (na počítači).

### Varianty na mobilu (`#kb-varianty`)
- Ikonka barev se už nezlamuje (v původním mobilním rozložení se dva barevné proužky smrštily na 3 px). Řádek je zalomený: nahoře ikonka a název varianty, pod nimi velikosti s kódy (do 840 px).

### Společné
- **Spodní lišta s modelem a cenou** (`buildStickyBar()`): po odrolování názvu nahoře se dole objeví lišta s názvem modelu, **akční cenou a původní (přeškrtnutou) cenou** (např. „Sector 2026  AKČNÍ CENA 69 990 Kč  PŮVODNÍ CENA 86 990 Kč“), aby bylo při rolování vidět, na jaký model se člověk dívá (inspirace Cateye). Při návratu nahoru zmizí. Tlačítko „zpět nahoru“ (kolečko se šipkou) se při zobrazené liště posune přímo do ní, vpravo.
- **Zarovnání textů**: žádné zarovnání do bloku, delší texty jsou zarovnané vlevo (původní web má `text-align: justify` na celém `body`).
- **Otevřená okna** (lightbox, popis, mobilní náhled): stránka pod nimi neroluje a je vidět jen jeden posuvník (původní web má `html { overflow-y: scroll }`, proto `html:has(> body.ng-lock) { overflow-y: hidden }`). Lightbox má plně černé pozadí.
- **Tlačítka**: stejně vysoká (32 px, fontTeuB 13 px, verzálky), menší než cena a KOUPIT TEĎ (ty zůstávají původní). Rozbalovací tlačítka „Více…“ (u popisu i u modelů) jsou šedý text se šipkou dolů/nahoru v barvě písma (ikona jako v mobilním akordeonu specifikace), při najetí oranžový.

## Pro programátora při nasazení

- Nasadit: `new/new.css` + `new/new.js` a 2 řádky do `<head>` šablony. Přepínač (`buildSwitch()` v JS, `.ds*` v CSS) lze smazat; pak natrvalo nastavit `data-design="new"` na `<html>` nebo pravidla odprefixovat.
- JS spoléhá na tyto třídy/ID původní šablony: `.lyp-gal`, `#sldKartaID` (slidy s `<img>` / `<iframe>`), `.lypi-perex`. Při změně šablony je potřeba upravit selektory v `collectItems()` a `buildCollapse()`.
- Galerie se staví z fotek původního slideru hned při `DOMContentLoaded` (ne až po načtení všech obrázků, `load` je jen pojistka). První velká fotka se stahuje přednostně (`fetchpriority="high"`): pro rychlý start se na okamžik ukáže střední varianta (740 px) a jakmile se načte **původní velká fotka** (1600 px), vymění se za ni, takže velká fotka je vždy původní, ne zvětšený náhled; náhledy (nejmenší varianty 200/440 px) se začnou stahovat až po jejím načtení (nejpozději za 2,5 s), fotky pro lightbox až po jeho otevření. Do doby sestavení drží místo šedá plocha 4:3. Žádná data navíc.
- Tlačítka WEB a MAPA v seznamu dealerů (`buildDealers()`) berou adresu z atributu `data-url` u odkazů koupit/objednat a mapa. V testovací kopii je tam původní adresa (`href` je `#`), v ostré verzi stačí číst `href` (v JS změnit `getAttribute('data-url')` na `getAttribute('href')`).
- Ikony počtu pod galerií: `new/ico_image.svg` (nová, Bootstrap Icons) a `../system/img/ico_camera.svg` (původní) – při nasazení upravit cestu v `new.css` podle umístění souborů.
- Náhled videa se tahá z `img.youtube.com` (jediný externí obrázek).
- Zůstávají externí skripty původního webu (Smartsupp chat, cookie lišta, GDPR) – lokálně se načítají živě.

## Spuštění

Stránku **neotvírat dvojklikem (file://)**: ikony jsou v CSS přes `mask-image` a Chrome je z file:// blokuje (chybí ikonky, galerie je prázdná). Spustit `start.bat` (lokální server na http://localhost:8080/index.html). Online: https://zajic70.github.io/a27-detail/

## Dočasné prvky testovací kopie (nejsou součástí změn, při nasazení smazat)

Slouží jen k vyzkoušení stránky, v ostré verzi být nemají.

- **Testovací úpravy (při nasazení vrátit):** chat Smartsupp odstraněn (komentář na jeho místě) a `<meta name="robots">` přepnuto z `index,follow` na `noindex,nofollow`, aby vyhledávače nebraly testovací kopii na GitHub Pages jako druhý web.
- **Testovací kopie nikam nepřekliká (při nasazení vrátit):** všech 380 odkazů `<a href>` vede na `#` (nechány jen `#!…` záložky specifikace, které čte `web.js`) a `action` hledacího formuláře je `#`. V `new.js` je navíc funkce `blockNavigation()`: ruší výchozí akci kliknutí na odkazy, odeslání formulářů a přepnutí jazyka (`#changeHreflang`). Původní odkazy jsou v `_orig/index_lokalni_kopie.html`.
- **Označení testovací kopie (při nasazení smazat):** logo v hlavičce je oranžové s černým okrajem a přetiskem „TEST PAGE“ (blok `DEV` na začátku v `new.css`, pravidla `.tpanel .logo`).
- **Přepínač Původní / Nový** vlevo dole (`.ds`) je rozbalovací a sbalovací: slovo „Design“ je tlačítko, které zbytek (Původní/Nový, Zobrazení Počítač/Mobil, Co je nového) rozbalí a zase sbalí; slovo „Design“ zůstává vždy vidět, stav se pamatuje (`localStorage` klíč `a24-ds-open`, výchozí je sbaleno). Volba přes `?design=old|new`, jinak z `localStorage` (klíč `a24-design`), výchozí je `new`. Druhá část přepínače **Počítač / Mobil** (`localStorage` klíč `a24-view`): Mobil zobrazí stejnou stránku v rámu (`iframe`, `.dsm`) širokém 390 px, takže platí mobilní styly; rám se načítá s `?frame=1` a v něm se přepínač nevytváří. Jen pro testování, maže se spolu s přepínačem. Tlačítko **Co je nového** v přepínači otevře okno (`.dsc`, seznam `CHANGES` v `new.js`) se stručným přehledem změn pro testery; maže se také s přepínačem.
- DEV blok na konci `new/new.css` (skrytí cookie lišty a dialogu chatu, zůstává jen kolečko) je jen pro testování, při nasazení smazat.

### Hostování na GitHubu

- **Stránka online:** https://zajic70.github.io/a27-detail/ (GitHub Pages, veřejný repozitář https://github.com/Zajic70/a27-detail, větev `main`). Slouží jen k prohlédnutí a vyzkoušení na mobilu; má `noindex,nofollow`, aby ji vyhledávače nebraly jako druhý web.
- **Co je v repozitáři:** `index.html`, `system/`, `data/`, `new/` a `CHANGES.md`. Složka `_orig/`, `_navrh/` a `start.bat` zůstávají jen lokálně (`.gitignore`). `.nojekyll` vypíná zpracování Jekyllem, `.gitattributes` nechává soubory beze změny konců řádků.
- **Aktualizace:** po každé úpravě se nahrává nová verze (commit a push), stránka se sama přenasadí do cca minuty. Při pochybnosti obnovit Ctrl+F5, prohlížeč si pamatuje starý skript a styly.
- **Co v repozitáři nechat při nasazení u Authoru:** jen `new/` (`new.css`, `new.js`, `author_oval.png`, `ico_image.svg`, `vip-bikes.png`) a 2 řádky v `<head>`; ostatní soubory jsou jen kopie původního webu.
