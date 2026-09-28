# Censimento fonti per regione

Ricerca svolta il 2026-09-28, verificando lo stato attuale delle fonti (non a
memoria). Metodo: WWF e LIPU pubblicano ciascuno un elenco nazionale delle
proprie oasi/riserve filtrabile per regione — è stato più efficiente e più
rispettoso (poche richieste, nessuno scraping aggressivo) consultare quegli
elenchi nazionali una volta a testa, invece di 20 ricerche separate per
regione. OpenStreetMap è stato interrogato con **una sola query Overpass**
per tutta Italia.

## Fonti nazionali usate

| Fonte | Cosa copre | Come è stata usata | Licenza / limiti |
|---|---|---|---|
| [wwf.it/oasi](https://www.wwf.it/dove-interveniamo/il-nostro-lavoro-in-italia/oasi/) | Elenco ufficiale delle 106 Oasi WWF, filtro per regione (interattivo, mappa+API, non un elenco statico) | Consultato per capire copertura e per le schede non presenti su parks.it (es. Castel Romano, Lazio) | Contenuti ©WWF Italia; citiamo fatti (nome, luogo, gestore) con link alla fonte, non copiamo i testi |
| [parks.it/wwf](https://www.parks.it/wwf/) | Sotto-insieme delle Oasi WWF con pagina statica per regione (`?reg=N`) | Fonte primaria per la maggior parte dei candidati WWF: più facile da leggere in modo pulito di wwf.it | Parks.it aggrega dati forniti dagli enti gestori; non è la fonte "originale" ma è mantenuta e ufficiosamente affidabile. **Non è esaustiva**: elenca meno oasi di quelle che WWF dichiara (106 nazionali, ne abbiamo contate circa 65 su parks.it) |
| [lipu.it/oasi-riserve](https://www.lipu.it/oasi-riserve) | Elenco ufficiale delle 26+ oasi/riserve LIPU, con mappa e nome+regione per ognuna | Fonte primaria per tutti i candidati LIPU | Contenuti ©LIPU; citiamo fatti con link alla fonte |
| [parks.it — Elenco Ufficiale Aree Naturali Protette (EUAP)](https://www.parks.it/ministero.ambiente/Elenco.Uff./R.N.S.html) | Fonte istituzionale (Ministero Ambiente) di tutti i parchi/riserve statali e regionali | Solo consultata per capire la sua esistenza e copertura, **non ancora processata voce per voce** (centinaia di aree: richiede una sessione dedicata, vedi sintesi.md) | Dato pubblico istituzionale, riusabile citando la fonte |
| OpenStreetMap (Overpass API) | Tag `leisure=bird_hide` e `leisure=wildlife_hide` | Una query Overpass unica per tutta Italia (vedi sotto) | Licenza ODbL: attribuzione obbligatoria; usato solo come indicatore di presenza, non come fonte di fatti pubblicabili (la maggior parte dei punti non ha nome) |

## Risultato della query OpenStreetMap (Overpass, tutta Italia)

Query eseguita il 2026-09-28 su `overpass-api.de`, con `User-Agent` identificativo
e una sola richiesta (non un loop):

```
[out:json][timeout:40];
area["ISO3166-1"="IT"][admin_level=2]->.it;
(
  node["leisure"="bird_hide"](area.it);
  way["leisure"="bird_hide"](area.it);
  node["leisure"="wildlife_hide"](area.it);
  way["leisure"="wildlife_hide"](area.it);
);
out center tags;
```

**Risultato: 439 elementi** in tutta Italia. Concentrazioni visibili (dalle
coordinate) in Veneto/Trentino, Lombardia, Emilia-Romagna, Toscana, Friuli,
Piemonte, con presenze minori ma reali anche in Puglia (serie di "altane"
lungo il fiume Ofanto), Sicilia, Sardegna, Lazio, Marche, Abruzzo.

**Ma solo una piccola minoranza ha un campo `name`** (la maggioranza risulta
"(senza nome)"): OSM conferma che il fenomeno esiste ed è diffuso, ma **non è
utilizzabile come fonte primaria di fatti pubblicabili** (non c'è un nome
verificabile né un link a un gestore). Conclusione invariata rispetto al
Veneto: OSM resta un buono strato "ci sono punti qui" per orientare la
ricerca manuale, non una fonte da cui trascrivere schede.

## Copertura WWF + LIPU per regione (candidati raccolti in dati/bozze/)

| Regione | WWF (parks.it/wwf.it) | LIPU | Totale candidati bozza |
|---|---|---|---|
| Piemonte | 3 | 1 | 4 |
| Lombardia | 3 | 5 | 8 |
| Trentino-Alto Adige | 2 | 0 | 2 |
| Veneto | — (già pubblicato, 13 schede) | 4 (3 nuove + Ca' Roman già pubblicata) | — |
| Friuli Venezia Giulia | 1 | 0 | 1 |
| Liguria | 2 | 1 | 3 |
| Emilia-Romagna | 7 (fonti secondarie, affidabilità media) | 3 | 10 |
| Toscana | 9 | 4 | 13 |
| Umbria | 1 | 0 | 1 |
| Marche | 2 | 0 | 2 |
| Lazio | 7 | 3 | 10 |
| Abruzzo | 1 | 0 | 1 |
| Molise | 1 | 2 | 3 |
| Campania | 7 | 2 | 9 |
| Puglia | 3 | 1 | 4 |
| Basilicata | 1 | 0 | 1 |
| Calabria | 1 | 0 | 1 |
| Sicilia | 4 | 3 | 7 |
| Sardegna | 2 | 1 | 3 |
| Valle d'Aosta | 0 (confermato: nessuna Oasi WWF) | 0 | 0 |

**Totale candidati in bozza (fuori Veneto): 83**, tutti con `published: false`
in `dati/bozze/{regione}.yaml`.

## Nota sul tipo "capanno fotografico a pagamento"

Come già emerso per il Veneto, questo tipo specifico **non ha un elenco
centralizzato**: va cercato gestore per gestore. La ricerca di stanotte si è
concentrata su oasi/riserve (WWF, LIPU) perché sono le uniche fonti che
permettono un censimento nazionale efficiente in poche ore. I capanni
fotografici a pagamento per le altre regioni restano da cercare uno per uno,
nella stessa sessione in cui si verifica e si completa ogni bozza.

## Concorrenza — verifica aggiornata

Nessuna novità sostanziale rispetto a quanto già verificato per il Veneto
(JuzaPhoto: elenco crowdsourced non strutturato; birdingplaces.eu: database
internazionale con copertura Italia parziale, non focalizzato sui capanni a
pagamento). Nessun sito trovato che copra sistematicamente capanni +
oasi/riserve per tutte le regioni italiane con schede verificate.
