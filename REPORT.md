# Report — sessione autonoma del 2026-09-28

Branch: `feature/home-e-dati-italia` (7 commit, elencati in fondo). **Nessun
merge su `main`, nessun deploy.** Il sito in produzione (Render) non è stato
toccato.

## Come vedere il risultato in locale

```bash
git checkout feature/home-e-dati-italia
npm install
npm run dev
```

Apri `http://localhost:4321`. La home (`/`) è la nuova pagina editoriale; la
mappa con filtri è su `/mappa`. Il pulsante sole/luna nell'header cambia
tema (persistente, ricordalo cambiando pagina). L'hamburger in alto a destra
apre il menu con tutte le voci richieste.

Per vedere le pagine generate: `npm run build` (73 pagine, invariato)
seguito da `npm run preview`.

---

## Blocco A — Identità, header, tema, home

**Fatto:**
- Tema chiaro pulito: sfondo bianco/quasi bianco, un solo colore d'accento
  (teal, `#0f6b5c` in chiaro / `#57c7ae` in scuro — prima erano due colori,
  verde+arancio). Ho scelto il teal perché è l'unico che superava 4.5:1 di
  contrasto su bianco E su nero scegliendo un solo colore per entrambi i temi
  (l'arancio precedente non ci riusciva in un tema chiaro senza scurirlo
  troppo). Tutti i colori sono variabili CSS in `src/styles/global.css`,
  contrasti calcolati e verificati con uno script (non a occhio) — vedi la
  tabella di verifica nei commit.
- Tema scuro con pulsante nell'header, icona sole/luna, `aria-label`
  accessibile, `localStorage`, **nessuna libreria**. Script anti-flash
  bloccante in testa a `<head>` (in `Base.astro`): legge la preferenza
  salvata prima del primo paint. Default sempre chiaro, non guarda
  `prefers-color-scheme` di sistema, come richiesto.
- Mappa in tema scuro: i tile OpenStreetMap restano quelli standard (nessuna
  modifica ai dati né all'attribuzione), solo un filtro CSS
  (`brightness/invert/hue-rotate`) applicato al livello dei tile via
  `:root[data-theme="dark"] #map .leaflet-tile-pane`. Marker, popup e
  controlli restano leggibili sopra il filtro.
- Header comune su tutte le pagine: nome del sito **al centro** (link alla
  home), hamburger **a destra** con il pulsante tema accanto. **Scelta
  destra/sinistra**: ho messo l'hamburger a destra perché è la convenzione
  più diffusa e quella a cui un utente italiano è più abituato (sinistra è
  associata più spesso a "indietro" nelle app mobile); se preferisci il
  contrario è un cambio di poche righe in `Header.astro` + `global.css`.
  Le 6 voci (Mappa, Regioni, Specie, Segnala un luogo, Come funziona,
  Contatti) sono `<a>` veri nell'HTML anche a menu chiuso (solo `display:
  none` via CSS, mai rimossi dal DOM). Tastiera, `aria-expanded`/
  `aria-controls`, Esc, clic fuori, bersagli 44px: tutti implementati e
  testati nel browser.
- Logo: uccello stilizzato **originale**, ispirato al cavaliere d'Italia
  (zampe lunghe, sagoma da zona umida — l'ho scelto perché è un simbolo
  forte e riconoscibile delle zone umide italiane, diverso da un generico
  "uccellino"). 3 varianti in `/design/logo-varianti/`
  (naturalistica/geometrica/minimale), verificate a 16/24/32/64/96px in
  chiaro e scuro prima di sceglierne una. **Applicata la variante 1
  (naturalistica) in via provvisoria** in `src/components/Logo.astro`: per
  cambiarla basta sostituire il markup SVG in quel file con il contenuto di
  un altro file della cartella varianti. Favicon SVG (con supporto
  `prefers-color-scheme` nativo), favicon PNG/ICO multi-risoluzione,
  apple-touch-icon e immagine Open Graph di default generati con uno script
  (`scripts/genera-immagini-identita.mjs`, riusabile se cambi il logo).
- Nuova home (`/`): hero con placeholder foto **dichiarato** (etichetta
  visibile "Foto segnaposto — da sostituire..."), "come funziona" a 3 passi
  con reveal allo scroll (`IntersectionObserver`, rispetta
  `prefers-reduced-motion`, testo comunque nell'HTML), anteprima Italia
  animata, sezione "perché fidarsi", le 20 regioni italiane con Veneto
  disponibile e le altre onestamente "in arrivo", invito a segnalare. I
  numeri (13 schede, 1 regione) sono calcolati da `getCollection`, mai
  scritti a mano.
- Mappa spostata da `/` a `/mappa` (stesso contenuto/comportamento di
  prima). Nuove pagine `/come-funziona` e `/contatti`.
- Email di contatto (`info@francescocaimophoto.it`) centralizzata in
  `src/config/site.ts`, usata in footer, `/segnala`, `/contatti` (anche come
  indirizzo per richieste di rimozione scheda da parte dei gestori). Link
  mailto semplice, nessun form, nessun servizio esterno, come richiesto.

**Verificato con Lighthouse (mobile, build di produzione):**
- Home: **100/100/100/100** (performance/accessibilità/best practices/SEO),
  LCP 1.1s, CLS 0
- `/mappa`: partiva da 100/91/96/100. Ho corretto i problemi reali trovati
  (marker senza nome accessibile, pulsanti zoom sotto 44px, ordine di
  intestazioni sbagliato su 4 pagine, colori mappa rimasti sulla palette
  vecchia) → arrivata a **100/96/100/100** (poi di nuovo 96 su performance
  in una singola misurazione, risultata rumore/variabilità di sistema più
  che un problema reale: le run successive tornavano a 100).

**Problemi noti, non risolti stanotte (annotati invece di improvvisare):**
- `target-size`: alcuni marker molto vicini fra loro sulla mappa (zona
  Treviso, dove ci sono più luoghi ravvicinati) hanno un'area cliccabile di
  24×24px che si sovrappone leggermente a quella del marker adiacente. La
  soluzione corretta è un plugin di clustering dei marker
  (`leaflet.markercluster` o simile), che raggrupperebbe i pin vicini in
  un unico cerchio espandibile: è una libreria in più e un cambiamento di
  comportamento della mappa, quindi non l'ho aggiunta senza il tuo ok.
- `image-size-responsive`: i tile OpenStreetMap standard sono serviti a
  256px, Lighthouse vorrebbe 384px (tile "retina" @2x). Il tile server
  gratuito standard di OSM non offre tile @2x: usarli richiederebbe un
  provider di tile diverso (spesso a pagamento), quindi ho lasciato questo
  limite noto invece di cambiare provider di mia iniziativa.

## Blocco C — Ricerca dati Italia (solo bozze)

**Fatto:** censimento fonti reale (non a memoria) per WWF, LIPU, EUAP,
OpenStreetMap; **83 candidati in bozza per 18 regioni** in
`dati/bozze/{regione}.yaml`, ognuno con solo nome/comune (se noto)/gestore/
tipo/fonte/data di consultazione — tutto il resto "da verificare", nessuna
coordinata, `published: false`. Documenti completi in `dati/ricerca/`:
`fonti-per-regione.md`, `non-verificati.md`, `sintesi.md` (con proposta
d'ordine di pubblicazione: Toscana → Lazio → Campania → Lombardia →
Sicilia, in base a quantità **e** affidabilità dei candidati).

**Verificato che le bozze non entrano nella build pubblica**: il loader in
`src/content.config.ts` legge solo `./data` (inglese); le bozze vivono in
`./dati` (italiano) — due cartelle con nomi diversi, nessuna sovrapposizione
strutturalmente possibile. Ho comunque verificato concretamente: grep
sull'intera cartella `dist/` per stringhe specifiche delle bozze (zero
risultati) e conteggio pagine identico prima/dopo (73). Non sono riuscito a
testare rimuovendo fisicamente la cartella `dati/` (Windows ha rifiutato il
rename con "permission denied", probabilmente un lock di qualche processo)
ma la prova per grep + il fatto strutturale dei due nomi diversi sono
equivalenti come garanzia.

**Deciso al posto tuo:** ho dato priorità a WWF e LIPU (fonti nazionali
filtrabili per regione, quindi censibili in poche richieste rispettose)
invece che a un tentativo di coprire tutto scavando regione per regione con
motori di ricerca. È il motivo per cui **i capanni fotografici a pagamento
sono quasi assenti dalle bozze** (0 su 83): quel tipo di luogo non ha un
elenco centralizzato da nessuna parte, esattamente come scoperto per il
Veneto, e cercarlo per tutte le 19 regioni in una notte non era realistico.
L'ho segnato come lacuna principale in `sintesi.md`.

**Problemi/lead da verificare (in `non-verificati.md`):**
- "Oasi WWF Monasterace" (Calabria) — nominata da una fonte secondaria, non
  trovata su nessuna pagina ufficiale WWF: probabile refuso o oasi dismessa.
- **WildlifeMajella** (Abruzzo, capanno fotografico a pagamento per orso
  bruno marsicano) — è il lead più concreto per riempire la lacuna dei
  capanni a pagamento, ma non l'ho riverificato stanotte con una fonte
  diretta: è il primo posto dove guardare quando lavori sull'Abruzzo.
- Valle d'Aosta: zero candidati WWF/LIPU trovati, va affrontata con altre
  fonti (Parco Nazionale Gran Paradiso, aree protette regionali).

## Blocco B — Foto nelle schede

**Fatto:** schema esteso con `immagine` opzionale (file, alt, autore,
licenza, data scatto, `scattata_sul_posto`), integrato con `astro:assets`
(helper `image()` nello schema Zod) per ottimizzazione automatica
(AVIF/WebP, più dimensioni/`srcset`, `width`/`height` per evitare layout
shift, lazy loading). Segnaposto pulito (icona fotocamera) quando manca la
foto — **nessuna scheda ha una foto reale stanotte**, come richiesto: tutte
e 13 restano con segnaposto. La build stampa un avviso non bloccante con
l'elenco delle schede senza foto.

**Verificato concretamente, non solo affermato**, che i metadati EXIF
(inclusa la posizione GPS) vengono rimossi: ho creato un'immagine di test
con GPS finto incorporato nell'EXIF (236 byte di dati), l'ho aggiunta a una
scheda reale del Veneto esattamente come farebbe un utente, ho lanciato la
build di produzione, e ho ispezionato con `sharp` tutti e 7 i file generati
in `dist/_astro/`: **zero metadati EXIF in ognuno**. Poi ho tolto la foto e
il riferimento (li trovi ripristinati puliti in `data/veneto/*.yaml`).

**Come aggiungere una foto senza toccare il codice** (istruzioni complete in
`docs/schema-scheda.md`): metti il file in
`data/{regione}/foto/{id}.jpg` e aggiungi il blocco `immagine:` nel file
YAML della scheda, con `file: ./foto/{id}.jpg`.

**Nota importante**: la rimozione EXIF riguarda **il file pubblicato**
(quello che finisce in `dist/`). Il file originale che metti in `data/`
mantiene i suoi metadati nel repository — se una foto ha GPS nell'EXIF e il
repository è pubblico (lo è, su GitHub), quei metadati restano leggibili
nella cronologia git anche se il sito pubblicato non li mostra. Per i luoghi
con specie sensibili, meglio togliere il GPS dalla foto stessa prima di
metterla nel repository (non solo affidarsi alla pipeline).

## Decisioni prese al posto tuo — riepilogo

| Cosa | Decisione provvisoria | Dove cambiarla |
|---|---|---|
| Nome del sito | "Capanni Italia" | `src/config/site.ts`, una riga |
| Logo | Variante 1 (naturalistica) | `src/components/Logo.astro`, sostituendo l'SVG con uno degli altri file in `/design/logo-varianti/` |
| Colore d'accento | Teal `#0f6b5c`/`#57c7ae` | `src/styles/global.css`, variabili `--color-accent*` |
| Hamburger | A destra | `Header.astro` + CSS `.bar` |
| Foto hero | Segnaposto scuro dichiarato | `src/pages/index.astro`, sezione `.hero` |
| Sagoma Italia (anteprima) | Disegno mio stilizzato, non geografico | `src/components/AnteprimaItalia.astro` |
| Ordine regioni da pubblicare | Toscana → Lazio → Campania → Lombardia → Sicilia | proposta in `dati/ricerca/sintesi.md`, decidi tu |

## Cosa NON è stato fatto (rimandato, non dimenticato)

- Nessuna foto reale nelle schede (richiesto esplicitamente).
- Nessuna scheda pubblicata fuori dal Veneto (richiesto esplicitamente).
- EUAP (Elenco Ufficiale Aree Naturali Protette) individuato come fonte ma
  non processato voce per voce: centinaia di aree, richiede una sessione
  dedicata.
- Clustering dei marker sulla mappa (risolverebbe l'ultimo problema di
  Lighthouse ma è una libreria in più, da decidere insieme).
- Nessun'altra modifica ai contenuti Veneto oltre alla rimozione del vecchio
  campo `immagini: []` non più usato.

## Commit su questo branch

```
df35408 Aggiunge piano di lavoro per la sessione autonoma
16a4295 A: configurazione sito, palette accessibile, tema chiaro/scuro
44b62dc A: logo originale (3 varianti) e identità visiva
4d738cf A: header con hamburger, nuova home editoriale, mappa spostata su /mappa
248bbca A: correzioni da audit Lighthouse mobile, verificato con dati reali
4575105 C: censimento fonti Italia e bozze non pubblicate (83 candidati, 18 regioni)
8e5f339 B: pipeline foto per le schede (schema, segnaposto, ottimizzazione, EXIF)
```
