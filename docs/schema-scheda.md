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
immagini: [{url, credit}]     # vuoto per ora, nessuna foto propria di questi luoghi
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
