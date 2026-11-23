# Sector 2026 – co se změnilo oproti původní stránce

Zdroj: https://cz.author.eu/sector-29-2026-ua42968602 (stáhnuto 2026-11-17).

## Struktura složky

| Cesta | Co to je |
|---|---|
| `index.html` | stránka (lokální kopie originálu + 2 řádky pro nový design) |
| `system/`, `data/` | stažené originální CSS, JS, fonty, obrázky (beze změny) |
| `new/new.css` | **nový design** – všechna pravidla pod `html[data-design="new"]` |
| `new/new.js` | **nový design** – galerie, sbalený popis, přepínač (vanilla JS, bez závislostí) |
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
5. **Testovací úpravy (při nasazení vrátit):** chat Smartsupp odstraněn (komentář na jeho místě) a `<meta name="robots">` přepnuto z `index,follow` na `noindex,nofollow`, aby vyhledávače nebraly testovací kopii na GitHub Pages jako druhý web.

6. **Testovací kopie nikam nepřekliká (při nasazení vrátit):** všech 380 odkazů `<a href>` vede na `#` (nechány jen `#!…` záložky specifikace, které čte `web.js`) a `action` hledacího formuláře je `#`. V `new.js` je navíc funkce `blockNavigation()`: ruší výchozí akci kliknutí na odkazy, odeslání formulářů a přepnutí jazyka (`#changeHreflang`). Původní odkazy jsou v `_orig/index_lokalni_kopie.html`.

Žádná jiná úprava HTML značek. Původní galerie (Slick) zůstává v DOM, v novém designu je jen skrytá.

Diff proti originálu: `diff _orig/index_lokalni_kopie.html index.html` (2 řádky nového designu + testovací úpravy z bodu 5). Složka `_orig/` je jen lokálně, do repozitáře se nenahrává.

## Co dělá nový design

- **Galerie**: velká fotka (4:3) s jednoduchými šipkami (jen chevron), swipem prstem i myší. Pod ní **jedna řada náhledů bez posuvníku** (posun prstem / tažením myši, okraje průhledně mizí), aktivní náhled má **oranžové podtržení** (#F29400); malé šipky jsou po stranách řady (vlevo a vpravo). Pod řadou uprostřed počet fotek a videí v podobě původní ikony videa z pravého sloupce: číslo a za ním ikona 19 px (fotky `new/ico_image.svg`, videa původní `system/img/ico_camera.svg`); klik skočí na první fotku / video. Původní ikona videa vpravo (`.lypi-naviico .kni-video`) je v novém designu skrytá, celý řádek jen pokud v něm není nic jiného (např. 3D model). Video je v řadě jako náhled s ikonou play. Klik na fotku otevře **lightbox se všemi fotkami (a videem) pod sebou**: scrolluje se, klepnutí/klik fotku zvětší (220 %), na mobilu jde i štípnutí; křížek nebo Esc zavře.
- **Otevřená okna** (lightbox, popis, mobilní náhled): stránka pod nimi neroluje a je vidět jen jeden posuvník – původní web má `html { overflow-y: scroll }`, proto `html:has(> body.ng-lock) { overflow-y: hidden }`. Lightbox má plně černé pozadí.
- **Jiný modelový rok** (`.lyp-time .timeline`, `buildYears()`): na mobilu (do 840 px) je to rozbalovací tmavý pruh se šipkou jako záložky specifikace, roky jsou výchozí sbalené. Na počítači beze změny.
- **Nadpisy Popis a Ostatní modely**: šedý pruh (#f0f0f0) přes celou šířku sloupce s oranžovým proužkem vlevo (4 px #F29400). Nadpis „Popis“ (`.ng-h`) vkládá JS nad sbalený text, „Ostatní modely“ je původní `.km-ostatni`.
- **Dlouhý popis** (`.lypi-perex`): sbalený na ~6 řádků s přechodem do bílé. Tlačítko „Více…“ (šedý text se šipkou) (napůl přes mizející spodní okraj textu) otevře **modální okno** s větším písmem: velká fotka, název a úvod, znovu hlavní přednosti (kopie `.lypi-hdl`) a pod nimi „Podrobný popis“ (zbytek textu). Úvod = první 2 bloky textu oddělené dvojitým `<br>`, zbytek je podrobný popis (viz `buildModal()` v JS). Zavření: křížek, klik mimo, Esc.
- **Přidat k porovnání / Doplňková výbava**: šedá tlačítka hned pod cenou (viz Tlačítka níže).
- **Přepínač Původní / Nový** vlevo dole (`.ds`). Volba přes `?design=old|new`, jinak z `localStorage` (klíč `a24-design`), výchozí je `new`. Druhá část přepínače **Počítač / Mobil** (`localStorage` klíč `a24-view`): Mobil zobrazí stejnou stránku v rámu (`iframe`, `.dsm`) širokém 390 px, takže platí mobilní styly; rám se načítá s `?frame=1` a v něm se přepínač nevytváří. Jen pro testování, maže se spolu s přepínačem. Tlačítko **Co je nového** v přepínači otevře okno (`.dsc`, seznam `CHANGES` v `new.js`) se stručným přehledem změn pro testery; maže se také s přepínačem.

## Pro programátora při nasazení

- Nasadit: `new/new.css` + `new/new.js` a 2 řádky do `<head>` šablony. Přepínač (`buildSwitch()` v JS, `.ds*` v CSS) lze smazat; pak natrvalo nastavit `data-design="new"` na `<html>` nebo pravidla odprefixovat.
- JS spoléhá na tyto třídy/ID původní šablony: `.lyp-gal`, `#sldKartaID` (slidy s `<img>` / `<iframe>`), `.lypi-perex`. Při změně šablony je potřeba upravit selektory v `collectItems()` a `buildCollapse()`.
- Galerie se staví z fotek původního slideru po události `load` – žádná data navíc.
- Ikony počtu pod galerií: `new/ico_image.svg` (nová, Bootstrap Icons) a `../system/img/ico_camera.svg` (původní) – při nasazení upravit cestu v `new.css` podle umístění souborů.
- Náhled videa se tahá z `img.youtube.com` (jediný externí obrázek).
- Zůstávají externí skripty původního webu (Smartsupp chat, cookie lišta, GDPR) – lokálně se načítají živě.
- DEV blok na konci `new/new.css` (skrytí cookie lišty a dialogu chatu, zůstává jen kolečko) je jen pro testování, při nasazení smazat.

## Spuštění

Stránku **neotvírat dvojklikem (file://)**: ikony jsou v CSS přes `mask-image` a Chrome je z file:// blokuje (chybí ikonky, galerie je prázdná). Spustit `start.bat` (lokální server na http://localhost:8080/index.html). Online: https://zajic70.github.io/a27-detail/
Chat Smartsupp je v `index.html` vypnutý (jen testovací úprava, původní skript je v `_orig/index_lokalni_kopie.html`).
- **Ostatní modely**: celý blok (nadpis, seznam, tlačítko) je vystředěný v pravém sloupci, viditelné jen 4, seznam dole mizí do bílé (obal `.ng-models-wrap`), v nadpisu počet (např. „ostatní modely (10)“). Tlačítko „Více…“ leží napůl přes mizející okraj; po rozbalení je pod seznamem jako „Méně…“ (`buildModels()` v JS).
- **Tlačítka**: všechna stejně vysoká (32 px, fontTeuB 13 px, verzálky), menší než cena a KOUPIT TEĎ (ty zůstávají původní). „Přidat k porovnání“ a „Doplňková výbava“ vypadají jako záložky specifikace (šedé #828282, bílé písmo, vedle sebe přes celou šířku, při najetí oranžové), leží hned pod cenou; vytvořená JS, klik předají původním odkazům (originál je v novém designu skrytý: `.k-mp-lmenu`). Rozbalovací tlačítka „Více…“ a „Více…“ u modelů jsou šedý text „Více…“ (u modelů po rozbalení „Méně…“) a vpravo jen šipka dolů/nahoru v barvě písma (maska, currentColor) na průhledném pozadí (ikona jako v mobilním akordeonu specifikace), při najetí oranžový.
