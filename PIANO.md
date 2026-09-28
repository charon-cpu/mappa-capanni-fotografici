# Piano di lavoro — sessione autonoma

## Stato del repo prima di iniziare (rilevato, non assunto)

- **Stack**: Astro 7 (output statico), Leaflet 1.9 per la mappa, `@astrojs/sitemap`.
  Dati letti da `data/{regione}/*.yaml` via content collection con `glob` loader
  (`src/content.config.ts`), schema Zod.
- **Pagine esistenti**: `/` (mappa + filtri + griglia schede, tutto insieme, nessuna
  home separata), `/regione/[regione]`, `/specie/[specie]`, `/tipo/[tipo]`,
  `/[regione]/[slug]` (scheda luogo), `/segnala` (mailto, placeholder
  `info@example.it`), `/404`.
- **Dati**: 13 schede pubblicate, tutte in `data/veneto/`. Schema documentato in
  `docs/schema-scheda.md`.
- **Stile**: CSS vanilla in `src/styles/global.css`, variabili colore in `:root`
  con override sotto `@media (prefers-color-scheme: dark)`. Palette attuale:
  sfondo `#faf9f6` (crema/giallino), testo `#1c231c`, verde primario `#2f5233`,
  accento arancio `#c96f34`. Nessun toggle manuale del tema.
- **Identità**: nessun logo, nessuna favicon disegnata (favicon.svg/ico sono i
  default generati da Astro), nome del sito hardcoded "Mappa dei Capanni
  Fotografici" nell'header di `Base.astro`.
- **Deploy**: Render, static site `mappa-capanni-fotografici.onrender.com`,
  auto-deploy da push su `main`. Repo GitHub `charon-cpu/mappa-capanni-fotografici`.

## Regole per questa sessione

- Branch `feature/home-e-dati-italia`, mai merge su `main`, mai deploy.
- Commit piccoli, uno per blocco logico.
- Ordine: **A** (identità/header/tema/home) → **C** (ricerca dati Italia, solo
  bozze non pubblicate) → **B** (foto nelle schede).
- Scelte reversibili (nome sito, logo, foto) applicate come placeholder
  espliciti e segnalate in `REPORT.md`, non decise in modo definitivo.
- Se un blocco è ambiguo o fallisce, annoto e passo oltre invece di inventare.
- Nessun dato inventato: bozze regionali solo con fonte ufficiale verificata.

## Blocco A — Identità, header, tema, home

1. File di configurazione unico per nome sito + email di contatto
   (`src/config/site.ts`), usato ovunque (header, footer, `/segnala`, `/contatti`).
2. Refactor palette: sfondo chiaro pulito, variabili CSS centralizzate,
   toggle tema chiaro/scuro con `localStorage` + script inline anti-flash,
   nessuna libreria.
3. Logo uccello stilizzato originale in SVG, 3 varianti in
   `/design/logo-varianti/`, una applicata come provvisoria.
4. Header comune: nome sito al centro, hamburger a destra su mobile (motivazione
   in `REPORT.md`), voci `Mappa / Regioni / Specie / Segnala un luogo / Come
   funziona / Contatti` come `<a>` reali nell'HTML.
5. Mappa spostata su `/mappa`; nuova home editoriale (hero, come funziona,
   anteprima animata Veneto, perché fidarsi, regioni disponibili/in arrivo,
   invito a segnalare, footer con attribuzione OSM + email).
6. Pagine nuove minime: `/come-funziona`, `/contatti` (se non già coperte).

## Blocco C — Ricerca dati Italia (solo bozze, non pubblicate)

1. `/dati/ricerca/fonti-per-regione.md`: censimento fonti per regione (OSM,
   WWF, LIPU, parchi/EUAP, Natura 2000), con affidabilità e licenza.
2. Verifica concorrenza (mappe/elenchi simili già esistenti) — sintesi con link.
3. `/dati/bozze/{regione}.yaml`: candidati con solo dati fattuali verificati
   (nome, comune, regione, tipo, fonte + data consultazione), resto vuoto/`da
   verificare`, `published: false`, campo affidabilità.
4. `/dati/ricerca/non-verificati.md` per luoghi non confermabili.
5. Verifica che le bozze non entrino nella build pubblica (mappa, sitemap,
   indici) — metodo di verifica documentato in `REPORT.md`.
6. Specie sensibili: mai coordinate precise, solo area/comune + flag.
7. Raccolta rispettosa: Overpass API per OSM, poche richieste, pause, nessuno
   scraping aggressivo, nessun testo copiato.
8. `/dati/ricerca/sintesi.md`: numeri per regione, lacune, proposta ordine di
   pubblicazione dopo il Veneto.

## Blocco B — Foto nelle schede

1. Schema scheda esteso con campo immagine (file, alt, autore/credito,
   licenza, data, `scattata_sul_posto: bool`).
2. Solo foto proprie o a licenza chiara; stanotte solo segnaposto (nessuna
   foto reale aggiunta).
3. Pipeline immagini: cartella dedicata, conversione AVIF/WebP con più
   dimensioni, `srcset`, lazy loading, `width`/`height` dichiarati, OG image
   per scheda.
4. Niente EXIF/GPS nei file pubblicati — verifica automatica.
5. Scheda senza foto: build non bloccata, avviso con elenco schede prive di
   foto.
6. Istruzioni in `REPORT.md` per aggiungere una foto senza toccare il codice.

## Cosa NON faccio

Banner/donazioni/pubblicità/iscrizioni, analytics/tracking, pubblicazione
schede fuori Veneto, merge su main, deploy, dati inventati.
