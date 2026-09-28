# Mappa dei Capanni Fotografici

Mappa di riferimento, verificata a mano sulle fonti ufficiali, dei capanni
fotografici a pagamento, degli osservatori per il birdwatching e delle oasi
naturalistiche in Italia. Sito statico generato con [Astro](https://astro.build).

## Struttura del progetto

```text
/
├── data/                    # sorgente dei dati: un file YAML per luogo, per regione
│   └── veneto/
│       └── *.yaml
├── docs/
│   └── schema-scheda.md     # schema campi di una scheda luogo
├── src/
│   ├── content.config.ts    # collection Astro che legge i file in data/
│   ├── components/          # mappa Leaflet, filtri, card
│   ├── layouts/Base.astro   # layout comune (meta tag, header, footer)
│   └── pages/                # home, pagine regione/specie/tipo, scheda luogo, segnala
└── astro.config.mjs
```

## Aggiungere o correggere un luogo

Aggiungi/modifica un file YAML in `data/{regione}/{slug}.yaml` seguendo lo
schema descritto in [docs/schema-scheda.md](docs/schema-scheda.md). Non serve
toccare codice: le pagine (scheda, indice per regione, per specie, per tipo)
vengono generate automaticamente al build.

Regole importanti:
- Non copiare testi da altri siti: descrizioni scritte da zero, con link alla fonte ufficiale in `fonte`.
- Ogni scheda ha `ultima_verifica` e `stato_affidabilità` (`verificato` / `da_verificare` / `segnalato_obsoleto`).
- Per specie sensibili (rapaci nidificanti, lupo, siti di nidificazione non già promossi pubblicamente dal gestore), usare `posizione.precisione: area_approssimata` con una `nota_precisione` che spiega perché.

## Comandi

| Comando           | Azione                                         |
| :----------------- | :---------------------------------------------- |
| `npm install`       | Installa le dipendenze                          |
| `npm run dev`       | Avvia il server di sviluppo su `localhost:4321` |
| `npm run build`     | Genera il sito statico in `./dist/`             |
| `npm run preview`   | Anteprima locale della build di produzione      |

## Deploy su Render

1. Pusha il repo su GitHub.
2. Su [render.com](https://render.com), crea un nuovo **Static Site** collegato al repo (Render legge automaticamente `render.yaml` se presente, oppure imposta a mano: build command `npm install && npm run build`, publish directory `dist`).
3. Render assegna un URL tipo `https://<nome-servizio>.onrender.com`. Aggiornalo in `astro.config.mjs` (campo `site`) e in `public/robots.txt` (riga `Sitemap:`), poi rifai il deploy.
4. Nessun dominio custom per ora: si può aggiungere in seguito dal pannello Render se il progetto convince.

## SEO

- Ogni scheda luogo ha `title`/`meta description` unici e dati strutturati `schema.org` (`Place`/`TouristAttraction`).
- Sitemap generata automaticamente in `/sitemap-index.xml` (integrazione `@astrojs/sitemap`).
- Attribuzione OpenStreetMap visibile sulla mappa e nel footer, come richiesto dalla licenza ODbL.
