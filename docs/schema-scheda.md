# Schema di una scheda luogo

Ogni luogo è un file YAML in `data/{regione}/{slug}.yaml`.

```yaml
id: string                    # slug univoco, es. "valle-averto"
nome: string
tipo: enum                    # capanno_fotografico | osservatorio_birdwatching | oasi_riserva
regione: string
provincia: string
comune: string
posizione:
  precisione: enum            # esatta | area_approssimata
  lat: float
  lon: float
  nota_precisione: string     # obbligatorio se area_approssimata, spiega perché
descrizione: text             # scritta da zero, non copiata da altre fonti
specie_principali: [string]   # per pagine indice /specie/
periodo_migliore: [string]    # mesi o stagioni
prenotazione_necessaria: bool
prezzo_indicativo: string     # facoltativo, con nota se da verificare
come_arrivare: text
contatti:
  telefono: string
  email: string
  sito_ufficiale: url
gestore: string
accessibilità: text           # facoltativo
immagine:                     # facoltativo: una scheda senza foto è valida, la build
                               # non si blocca (compare solo un avviso in console)
  file: ./foto/{id}.jpg       # percorso relativo al file YAML, vedi sotto
  alt: string                 # testo alternativo descrittivo
  autore: string               # credito fotografo
  licenza: string               # es. "© Nome Cognome, tutti i diritti riservati"
  data_scatto: date            # facoltativo
  scattata_sul_posto: bool     # false = mostra la specie/l'ambiente ma non è
                               # stata scattata in quel luogo esatto: la scheda lo
                               # segnala esplicitamente in didascalia
fonte: url                    # link al gestore/ente ufficiale usato per verificare i dati
ultima_verifica: date
stato_affidabilità: enum      # verificato | da_verificare | segnalato_obsoleto
note_interne: text            # non pubblicato, per revisione manuale
```

## Regola specie sensibili

Se un luogo riguarda specie delicate (rapaci nidificanti, lupo, siti di nidificazione)
e questo non è già pubblicamente promosso dal gestore con posizione esatta, si usa
`precisione: area_approssimata` con `nota_precisione` che spiega il motivo, e si
segnala esplicitamente nella review.

Nessuno dei luoghi del Veneto (batch di validazione) è in questa categoria: sono
tutti luoghi con indirizzo pubblicato dal gestore stesso (WWF, LIPU, comune, parco).

## Aggiungere una foto a una scheda (senza toccare il codice)

1. Metti il file immagine (JPEG o PNG, qualunque risoluzione: la build la
   ottimizza da sola) in `data/{regione}/foto/{id}.jpg`, dove `{id}` è lo
   stesso slug della scheda. Esempio: la foto di `data/veneto/oasi-cervara.yaml`
   va in `data/veneto/foto/oasi-cervara.jpg`.
2. Nel file YAML della scheda aggiungi il blocco `immagine:` come nello
   schema sopra, con `file: ./foto/oasi-cervara.jpg`.
3. Usa solo foto tue o con licenza chiara — mai foto prese dal sito del
   gestore o da altri siti.
4. Alla build, Astro genera automaticamente le versioni WebP/AVIF in più
   dimensioni, imposta `width`/`height` per evitare layout shift, e
   **rimuove i metadati EXIF (inclusa la posizione GPS) dal file
   pubblicato** — il file originale che hai messo in `data/` resta con i
   suoi metadati nel repository, solo l'output pubblico ne è privo. Se il
   luogo ha specie sensibili, non mettere comunque la posizione precisa nel
   nome del file o nella didascalia.
5. Una scheda senza `immagine` resta valida: compare un segnaposto al posto
   della foto, e la build stampa (senza fallire) l'elenco delle schede
   ancora senza foto.
