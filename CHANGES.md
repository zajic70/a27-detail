# Sector 2026 – co se změnilo oproti původní stránce

Zdroj: https://cz.author.eu/sector-29-2026-ua42968602 (stáhnuto 2026-11-17).

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

- **Galerie**: velká fotka (4:3) s jednoduchými šipkami (jen chevron), swipem prstem i myší. Pod ní **jedna řada náhledů bez posuvníku** (posun prstem / tažením myši, okraje průhledně mizí), aktivní náhled má **oranžové podtržení** (#F29400); malé šipky leží přes levý a pravý okraj řady, fotky pod nimi prosvítají (šipka je vidět jen tam, kam se dá řada posunout). Pod řadou uprostřed počet fotek a videí v podobě původní ikony videa z pravého sloupce: číslo a za ním ikona 19 px (fotky `new/ico_image.svg`, videa původní `system/img/ico_camera.svg`); klik skočí na první fotku / video. Původní ikona videa vpravo (`.lypi-naviico .kni-video`) je v novém designu skrytá, celý řádek jen pokud v něm není nic jiného (např. 3D model). Video je v řadě jako náhled s ikonou play. Klik na fotku otevře **lightbox se všemi fotkami (a videem) pod sebou** (křížek je na oranžovém kruhu, aby byl vidět i nad bílou fotkou): scrolluje se, klepnutí/klik fotku zvětší (220 %), na mobilu jde i štípnutí; křížek nebo Esc zavře.
- **Otevřená okna** (lightbox, popis, mobilní náhled): stránka pod nimi neroluje a je vidět jen jeden posuvník – původní web má `html { overflow-y: scroll }`, proto `html:has(> body.ng-lock) { overflow-y: hidden }`. Lightbox má plně černé pozadí.
- **Jiný modelový rok** (`.lyp-time .timeline`, `buildYears()`): na mobilu (do 840 px) je to rozbalovací tmavý pruh se šipkou jako záložky specifikace, roky jsou výchozí sbalené, písmo stejné jako u záložek (`fontTeuL`). Na počítači beze změny.
- **Piktogramy** (`.ng-soc`, `buildSocial()`): pod štítky a nad „Ostatní modely“ malý jemně šedý blok „odjinud“ (pozadí #f6f6f6) s nadpisem „Novinky, návody, akce a tipy“ drobným šedým písmem na středu a pěti ikonami VIP Bikes, Facebook, Instagram, YouTube, Newsletter. Aplikační ikony 28 px se zaobleným čtvercem a barevným přechodem; VIP Bikes je černá s bílým nápisem „VIP“ a ikonou kola a popiskem „Author’s Heroes“, každá ikona má v rohu malý červený ovál Author (`new/author_oval.png`, vyříznutý z původního loga bez nápisu). Odkazy v testovací kopii vedou na `#`, skutečné cíle jsou v atributu `data-url`: VIP Bikes https://hero.author.eu/, https://www.facebook.com/Author.cz/?locale=cs_CZ, https://www.instagram.com/authorbicycles/, https://www.youtube.com/@authoradmin; **adresa Newsletteru zatím není doplněná** (`data-url` je prázdné). Při nasazení dát `data-url` do `href`.
- **Nadpisy Popis a Ostatní modely**: šedý pruh (#f0f0f0) přes celou šířku sloupce s oranžovým proužkem vlevo (4 px #F29400). Nadpis „Popis“ (`.ng-h`) vkládá JS nad sbalený text, „Ostatní modely“ je původní `.km-ostatni`.
- **Dlouhý popis** (`.lypi-perex`): sbalený (větší písmo 1,05 rem, tučné 1 rem, výška ~10 rem) s přechodem do bílé. Tlačítko „Více…“ (šedý text se šipkou, popis v modálním okně – stejné řešení jako na Alze) (napůl přes mizející spodní okraj textu) otevře **modální okno** s větším písmem: velká fotka, název a úvod, znovu hlavní přednosti (kopie `.lypi-hdl`) a pod nimi „Podrobný popis“ (zbytek textu). Úvod = první 2 bloky textu oddělené dvojitým `<br>`, zbytek je podrobný popis (viz `buildModal()` v JS). Zavření: křížek, klik mimo, Esc.
- **Barevné varianty** (`.lypi-barva`): bez popisku „Barevné varianty“, zůstávají jen barevné čtverečky (jen CSS).
- **Kde koupit – seznam dealerů** (`#kb-dostupnost`, jen CSS): 
  - u dealera s proklikem na web se ukáže jen **město, web (tlačítko) a mapa**; telefon a e-mail jsou schované, zájemce je najde na webu dealera (stejný princip jako na ketaj.cz). Dealeři bez webu mají kontakt dál. Hlavička sloupce „Kontakt na prodejce“ zůstává jen proto, že takový dealer (Pavel Brabec) v seznamu je. Na mobilu se kontakt schová úplně.
  - informace s košíkem, „skladem“ a „objednat“ ve sloupci Dostupnost se u dealerů nezobrazuje (není důležitá a vedla na totéž co tlačítko, byla tam dvě stejná tlačítka); zůstává jen jedno barevné tlačítko. Sloupec Dostupnost má dál obsah jen u souhrnných řádků („11 prodejen“, „Na ostatních prodejnách“).
  - všechna nákupní tlačítka v seznamu (objednat teď, koupit teď) mají jednotný vzhled jako hlavní KOUPIT TEĎ: červená, při najetí tmavě šedá. Dřív byla „objednat teď“ oranžová a „koupit teď“ červená.
- **Varianty na mobilu** (`#kb-varianty`): ikonka barev se už nezlamuje (v původním mobilním rozložení se dva barevné proužky smrštily na 3 px). Řádek je zalomený: nahoře ikonka a název varianty, pod nimi velikosti s kódy (jen CSS, do 840 px).
- **Cena** (`.k-cena`): celá sekce je zarovnaná vpravo. Nahoře původní cena, pod ní tlačítko KOUPIT TEĎ a těsně za ním (úplně vpravo) šedé pole s akční cenou. Jen CSS, vzhled prvků zůstává původní.
- **Přidat k porovnání / Doplňková výbava**: šedá tlačítka hned pod cenou (viz Tlačítka níže).
- **Ostatní modely**: celý blok (nadpis, seznam, tlačítko) je vystředěný v pravém sloupci, viditelné jen 4, seznam dole mizí do bílé (obal `.ng-models-wrap`), v nadpisu počet (např. „ostatní modely (10)“). Tlačítko „Více…“ leží napůl přes mizející okraj; po rozbalení je pod seznamem jako „Méně…“ (`buildModels()` v JS).
- **Tlačítka**: všechna stejně vysoká (32 px, fontTeuB 13 px, verzálky), menší než cena a KOUPIT TEĎ (ty zůstávají původní). „Přidat k porovnání“ a „Doplňková výbava“ vypadají jako záložky specifikace (šedé #828282, bílé písmo, vedle sebe přes celou šířku, při najetí oranžové), leží hned pod cenou; vytvořená JS, klik předají původním odkazům (originál je v novém designu skrytý: `.k-mp-lmenu`). Rozbalovací tlačítka „Více…“ a „Více…“ u modelů jsou šedý text „Více…“ (u modelů po rozbalení „Méně…“) a vpravo jen šipka dolů/nahoru v barvě písma (maska, currentColor) na průhledném pozadí (ikona jako v mobilním akordeonu specifikace), při najetí oranžový.

## Pro programátora při nasazení

- Nasadit: `new/new.css` + `new/new.js` a 2 řádky do `<head>` šablony. Přepínač (`buildSwitch()` v JS, `.ds*` v CSS) lze smazat; pak natrvalo nastavit `data-design="new"` na `<html>` nebo pravidla odprefixovat.
- JS spoléhá na tyto třídy/ID původní šablony: `.lyp-gal`, `#sldKartaID` (slidy s `<img>` / `<iframe>`), `.lypi-perex`. Při změně šablony je potřeba upravit selektory v `collectItems()` a `buildCollapse()`.
- Galerie se staví z fotek původního slideru hned při `DOMContentLoaded` (ne až po načtení všech obrázků, `load` je jen pojistka). První velká fotka se stahuje přednostně (`fetchpriority="high"`) a v rozumné velikosti podle okna (`srcset` + `sizes`, ne 1600px originál); náhledy (nejmenší varianty 200/440 px) se začnou stahovat až po jejím načtení (nejpozději za 2,5 s), fotky pro lightbox až po jeho otevření. Do doby sestavení drží místo šedá plocha 4:3. Žádná data navíc.
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

- **Přepínač Původní / Nový** vlevo dole (`.ds`). Volba přes `?design=old|new`, jinak z `localStorage` (klíč `a24-design`), výchozí je `new`. Druhá část přepínače **Počítač / Mobil** (`localStorage` klíč `a24-view`): Mobil zobrazí stejnou stránku v rámu (`iframe`, `.dsm`) širokém 390 px, takže platí mobilní styly; rám se načítá s `?frame=1` a v něm se přepínač nevytváří. Jen pro testování, maže se spolu s přepínačem. Tlačítko **Co je nového** v přepínači otevře okno (`.dsc`, seznam `CHANGES` v `new.js`) se stručným přehledem změn pro testery; maže se také s přepínačem.
- DEV blok na konci `new/new.css` (skrytí cookie lišty a dialogu chatu, zůstává jen kolečko) je jen pro testování, při nasazení smazat.

### Hostování na GitHubu

- **Stránka online:** https://zajic70.github.io/a27-detail/ (GitHub Pages, veřejný repozitář https://github.com/Zajic70/a27-detail, větev `main`). Slouží jen k prohlédnutí a vyzkoušení na mobilu; má `noindex,nofollow`, aby ji vyhledávače nebraly jako druhý web.
- **Co je v repozitáři:** `index.html`, `system/`, `data/`, `new/` a `CHANGES.md`. Složka `_orig/`, `_navrh/` a `start.bat` zůstávají jen lokálně (`.gitignore`). `.nojekyll` vypíná zpracování Jekyllem, `.gitattributes` nechává soubory beze změny konců řádků.
- **Aktualizace:** po každé úpravě se nahrává nová verze (commit a push), stránka se sama přenasadí do cca minuty. Při pochybnosti obnovit Ctrl+F5, prohlížeč si pamatuje starý skript a styly.
- **Co v repozitáři nechat při nasazení u Authoru:** jen `new/` (`new.css`, `new.js`, `author_oval.png`, `ico_image.svg`) a 2 řádky v `<head>`; ostatní soubory jsou jen kopie původního webu.
