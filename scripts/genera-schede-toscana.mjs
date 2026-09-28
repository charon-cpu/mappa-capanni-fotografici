import { writeFileSync, mkdirSync, existsSync } from 'node:fs';

const oggi = '2026-09-28';

function y(v) {
  if (v === null || v === undefined) return '""';
  const s = String(v);
  if (/^[a-zA-Z0-9_.\-]+$/.test(s)) return s;
  return `"${s.replace(/"/g, '\\"')}"`;
}
function block(v) {
  return `>\n  ${v.replace(/\n/g, '\n  ')}`;
}
function arr(list) {
  if (!list.length) return ' []';
  return '\n' + list.map((v) => `  - ${y(v)}`).join('\n');
}

const luoghi = [
  {
    id: 'oasi-wwf-padule-orti-bottagone',
    nome: "Oasi WWF Padule Orti-Bottagone",
    provincia: 'Livorno', comune: 'Piombino',
    lat: 42.9542378, lon: 10.5999014,
    descrizione: `Zona umida costiera alle porte di Piombino, tra le poche paludi salmastre superstiti della costa toscana. Conta 231 specie di uccelli osservate: tra gli svernanti germano reale, codone e airone cenerino; tra i nidificanti spatola, airone rosso e falco pescatore. Sono previsti accessi dedicati per fotografi e birdwatcher in orari e giorni specifici, sempre su prenotazione.`,
    specie: ['Germano reale', 'Codone', 'Airone cenerino', 'Falco di palude', 'Falco pellegrino', 'Spatola', 'Airone rosso', 'Falco pescatore'],
    periodo: ['inverno (svernanti)', 'primavera (migratori)'],
    prenotazione: true,
    prezzo: '10 € intero, 8 € ridotto (verificare aggiornamento)',
    comeArrivare: `Strada Prov. 40 Geodetica, km 6,700 - Località Torre del Sale, Piombino (LI).`,
    telefono: '389 9578763', email: 'ortibottagone@wwf.it', sito: 'https://www.wwf.it/dove-interveniamo/il-nostro-lavoro-in-italia/oasi/bottagone/',
    gestore: 'WWF Italia', accessibilita: 'non specificata, da verificare',
    fonte: 'https://www.wwf.it/dove-interveniamo/il-nostro-lavoro-in-italia/oasi/bottagone/',
    stato: 'verificato',
    note: 'Prezzo trovato su fonte secondaria (ricerca aggregata), non sulla pagina ufficiale WWF: da riconfermare.',
    foto: { autore: 'Giggi95 (Wikimedia Commons)', licenza: 'CC BY-SA 3.0', data: '2010-08-25', alt: "Vista della palude costiera dell'Oasi Orti-Bottagone", sulPosto: true },
  },
  {
    id: 'oasi-wwf-lago-di-burano',
    nome: 'Oasi WWF Lago di Burano',
    provincia: 'Grosseto', comune: 'Capalbio',
    lat: 42.4084215, lon: 11.3717085,
    descrizione: `Riserva WWF sul lago costiero di Burano, in Maremma, con oltre 300 specie di uccelli osservate. Tra le specie caratteristiche folaga, moriglione, moretta tabaccata e falco di palude; tra i mammiferi istrice, tasso, volpe, donnola e cinghiale, con passaggi occasionali di lupo. Le visite guidate partono dal centro visite dell'oasi.`,
    specie: ['Folaga', 'Moriglione', 'Moretta tabaccata', 'Falco di palude', 'Porciglione', 'Istrice', 'Tasso'],
    periodo: ['autunno-primavera (migrazioni)'],
    prenotazione: true,
    prezzo: '8 € visita guidata; 2 € passeggiata al centro visite',
    comeArrivare: `Strada provinciale Litoranea del Chiarone, 35 - Capalbio Scalo (GR). Raggiungibile anche in treno (stazione di Capalbio Scalo).`,
    telefono: '0564 898829', email: 'lagodiburano@wwf.it', sito: 'https://www.wwf.it/dove-interveniamo/il-nostro-lavoro-in-italia/oasi/lago-di-burano/',
    gestore: 'WWF Italia', accessibilita: 'non specificata, da verificare',
    fonte: 'https://www.wwf.it/dove-interveniamo/il-nostro-lavoro-in-italia/oasi/lago-di-burano/',
    stato: 'verificato',
    note: '',
    foto: { autore: '66colpi (Wikimedia Commons)', licenza: 'CC BY-SA 4.0', data: '2019-08-16', alt: "Birdwatching tra i canneti dell'Oasi Lago di Burano", sulPosto: true },
  },
  {
    id: 'capra-matilda',
    nome: 'Capra Matilda',
    provincia: 'Grosseto', comune: 'Roccalbegna',
    lat: 42.7859754, lon: 11.5076818,
    posPrecisione: 'area_approssimata',
    posNota: "Oasi affiliata WWF coincidente con un'azienda agricola privata: coordinate al livello del comune (Roccalbegna/Semproniano), non è stato trovato un indirizzo puntuale pubblicato.",
    descrizione: `Azienda agricola biologica affiliata al WWF alle pendici del Monte Amiata, tra i comuni di Roccalbegna e Semproniano. Alleva animali di razze locali a rischio di estinzione su 62,5 ettari tra campi, prati e boschi. Fa parte del circuito "Fattorie del Panda" e offre ospitalità agrituristica.`,
    specie: [],
    periodo: ['da verificare'],
    prenotazione: true,
    prezzo: 'da verificare (azienda agrituristica, non oasi a ingresso singolo)',
    comeArrivare: `Località Podere il Cancellone, Roccalbegna (GR).`,
    telefono: '0564 980123', email: 'antonio_pastorelli@virgilio.it', sito: 'https://www.agriturismocapramatilda.it',
    gestore: 'Azienda Agricola Pastorelli (Oasi Affiliata WWF)', accessibilita: 'da verificare',
    fonte: 'https://www.parks.it/oasi.capra.matilda/contatti.php',
    stato: 'da_verificare',
    note: 'Nessuna foto con licenza chiara trovata su Wikimedia Commons per questo luogo specifico (azienda privata poco fotografata pubblicamente): resta segnaposto.',
    foto: null,
  },
  {
    id: 'dynamo',
    nome: 'Oasi Dynamo',
    provincia: 'Pistoia', comune: 'San Marcello Piteglio',
    lat: 44.0282307, lon: 10.7657375,
    posPrecisione: 'area_approssimata',
    posNota: "Coordinata al livello della frazione di Piteglio: indirizzo esatto (Via Privata San Vito 1) non geocodificabile con precisione da fonti aperte.",
    descrizione: `Riserva WWF affiliata di oltre 1.000 ettari nell'Appennino pistoiese, tra i 600 e i 1.100 metri di quota. Ospita grandi ungulati (capriolo, muflone, cervo, daino, cinghiale), carnivori (lupo, faina, volpe, donnola) e uccelli come il picchio nero e l'averla cenerina. Le visite sono guidate, solo su calendario e prenotazione.`,
    specie: ['Lupo', 'Capriolo', 'Muflone', 'Cervo', 'Picchio nero', 'Picchio verde', 'Averla cenerina', 'Tottavilla'],
    periodo: ['da verificare'],
    prenotazione: true,
    prezzo: 'da verificare',
    comeArrivare: `Via Privata San Vito 1, Località Piteglio, San Marcello Piteglio (PT). Da Firenze/Lucca: A11 uscita Pistoia, verso l'Abetone, a Le Piastre svoltare per Piteglio.`,
    telefono: '345 6410737', email: 'info@oasidynamo.org', sito: 'https://www.oasidynamo.org/',
    gestore: 'Oasi Dynamo Società Agricola Srl (Oasi Affiliata WWF)', accessibilita: 'da verificare',
    fonte: 'https://www.wwf.it/dove-interveniamo/il-nostro-lavoro-in-italia/oasi/oasi-dynamo/',
    stato: 'da_verificare',
    note: 'Nessuna foto con licenza chiara trovata su Wikimedia Commons per questo luogo: resta segnaposto.',
    foto: null,
  },
  {
    id: 'gabbianello',
    nome: 'Oasi WWF Gabbianello',
    provincia: 'Firenze', comune: 'Barberino di Mugello',
    lat: 44.0132915, lon: 11.2894405,
    descrizione: `Area protetta di 25 ettari sulle rive del Lago di Bilancino, nel Mugello. Rifugio per uccelli migratori come tarabuso, cavaliere d'Italia e avocetta grazie alla fitta vegetazione palustre; in inverno e primavera si osservano anche fenicotteri rosa e falchi pescatori di passo, oltre a diverse specie di anatre (moriglione, mestolone, alzavola, fischione).`,
    specie: ['Tarabuso', 'Cavaliere d\'Italia', 'Avocetta', 'Falco pescatore', 'Albanella reale', 'Falco pellegrino', 'Moriglione', 'Alzavola'],
    periodo: ['inverno', 'primavera'],
    prenotazione: false,
    prezzo: 'da verificare',
    comeArrivare: `Via di Galliano 1, 50031 Barberino di Mugello (FI), 5 km da Barberino, 30 km da Firenze.`,
    telefono: '055 5535003 / 333 9537114', email: 'gabbianello@wwf.it', sito: 'http://www.gabbianello.it',
    gestore: 'WWF Italia (Oasi Affiliata)', accessibilita: 'da verificare',
    fonte: 'https://www.parks.it/anp.gabbianello.boscotondo/index.php',
    stato: 'verificato',
    note: '',
    foto: { autore: 'Morelli Dario (Wikimedia Commons)', licenza: 'CC BY-SA 3.0', data: '2012-09-03', alt: "Vista del Lago di Bilancino dall'Oasi Gabbianello", sulPosto: true },
  },
  {
    id: 'oasi-wwf-bosco-rocconi',
    nome: 'Oasi WWF Bosco Rocconi',
    provincia: 'Grosseto', comune: 'Roccalbegna',
    lat: 42.7859754, lon: 11.5076818,
    posPrecisione: 'area_approssimata',
    posNota: 'Coordinata al livello del comune di Roccalbegna: la riserva si estende anche nel comune di Semproniano, indirizzo puntuale non pubblicato.',
    descrizione: `Riserva naturale di oltre 370 ettari lungo la valle del fiume Albegna, tra i comuni di Roccalbegna e Semproniano, con pareti rocciose verticali, un canyon scavato dai fiumi Albegna e Rigo, e boschi ricchi di circa 30 specie di orchidee selvatiche. Il falco pellegrino è il simbolo dell'oasi; frequenti anche il biancone, il merlo acquaiolo e il picchio muraiolo sulle pareti rocciose.`,
    specie: ['Falco pellegrino', 'Biancone', 'Merlo acquaiolo', 'Picchio muraiolo', 'Martora', 'Gatto selvatico'],
    periodo: ['primavera-estate (fioriture e farfalle)'],
    prenotazione: true,
    prezzo: '10 € intero, 6 € soci WWF',
    comeArrivare: `Comune di Roccalbegna (GR), valle del fiume Albegna.`,
    telefono: '320 8223972', email: 'boscorocconi@wwf.it', sito: 'https://www.wwf.it/dove-interveniamo/il-nostro-lavoro-in-italia/oasi/bosco-rocconi/',
    gestore: 'WWF Italia', accessibilita: 'visite sempre guidate, cambio di quota fino a 400m',
    fonte: 'https://www.wwf.it/dove-interveniamo/il-nostro-lavoro-in-italia/oasi/bosco-rocconi/',
    stato: 'verificato',
    note: '',
    foto: { autore: 'Vinattieri Matteo (Wikimedia Commons)', licenza: 'Pubblico dominio', data: '2006-08-01', alt: 'Il bosco e le pareti rocciose della Riserva Bosco dei Rocconi', sulPosto: true },
  },
  {
    id: 'oasi-wwf-laguna-di-orbetello-di-ponente',
    nome: 'Oasi WWF Laguna di Orbetello di Ponente',
    provincia: 'Grosseto', comune: 'Orbetello',
    lat: 42.4380944, lon: 11.2107429,
    posPrecisione: 'area_approssimata',
    posNota: 'Coordinata al livello del comune di Orbetello: indirizzo puntuale non pubblicato nelle fonti consultate.',
    descrizione: `Riserva WWF sulla laguna occidentale di Orbetello, celebre per i fenicotteri rosa e le grandi concentrazioni di anatre, oche, aironi e limicoli in migrazione. Il Bosco di Patanella, all'interno della riserva, è visitabile liberamente ogni giorno.`,
    specie: ['Fenicottero', 'Falco di palude', 'Falco pescatore', 'Sterna comune', 'Pavoncella', 'Gru'],
    periodo: ['settembre-maggio'],
    prenotazione: false,
    prezzo: '6 €, gratuito per i soci WWF',
    comeArrivare: `Riserva sulla laguna di Ponente, Comune di Orbetello (GR).`,
    telefono: 'da verificare', email: 'da verificare', sito: 'https://www.wwf.it/dove-interveniamo/il-nostro-lavoro-in-italia/oasi/laguna-di-orbetello/',
    gestore: 'WWF Italia', accessibilita: 'Bosco di Patanella liberamente accessibile ogni giorno',
    fonte: 'https://www.wwf.it/dove-interveniamo/il-nostro-lavoro-in-italia/oasi/laguna-di-orbetello/',
    stato: 'verificato',
    note: '',
    foto: { autore: 'Wwikiwalter / Walter Ferretti (Wikimedia Commons)', licenza: 'CC BY-SA 4.0', data: '2016-08-11', alt: 'La Riserva Naturale Laguna di Orbetello di Ponente', sulPosto: true },
  },
  {
    id: 'padule-di-bolgheri',
    nome: 'Oasi WWF Padule di Bolgheri',
    provincia: 'Livorno', comune: 'Castagneto Carducci',
    lat: 43.1599830, lon: 10.6002338,
    posPrecisione: 'area_approssimata',
    posNota: "Coordinata sulla strada provinciale indicata come riferimento (SP della zona): l'accesso esatto è privato e su prenotazione, non pubblicato come indirizzo puntuale.",
    descrizione: `Rifugio faunistico privato di 513 ettari tra stagni, prati allagati e pineta, con sei osservatori faunistici lungo i sentieri tracciati. Le cicogne sono tornate a nidificare qui dal 2008, dopo 200 anni di assenza. Tra gli svernanti germano reale, fischione, mestolone, codone, canapiglia e alzavola; in primavera pittima reale, combattente, pettegola e pantana.`,
    specie: ['Cicogna bianca', 'Fischione', 'Mestolone', 'Codone', 'Pittima reale', 'Combattente', 'Tuffetto', 'Avocetta'],
    periodo: ['novembre-aprile'],
    prenotazione: true,
    prezzo: 'da verificare',
    comeArrivare: `SP 39, km 269,4 - 57022 Castagneto Carducci (LI).`,
    telefono: '328 1937095 / 389 9578763', email: 'paduledibolgheri@sassicaia.com', sito: 'https://www.wwf.it/dove-interveniamo/il-nostro-lavoro-in-italia/oasi/padule-di-bolgheri/',
    gestore: 'WWF Italia (Oasi Affiliata, proprietà privata)', accessibilita: 'da verificare',
    fonte: 'https://www.wwf.it/dove-interveniamo/il-nostro-lavoro-in-italia/oasi/padule-di-bolgheri/',
    stato: 'verificato',
    note: 'Prezzo di ingresso non trovato in nessuna fonte consultata: da chiedere direttamente al gestore.',
    foto: { autore: 'Stefano Benucci (Wikimedia Commons)', licenza: 'CC BY-SA 4.0', data: '2019-12-24', alt: 'Vista panoramica della zona nord del Padule di Bolgheri', sulPosto: true },
  },
  {
    id: 'san-felice',
    nome: 'Oasi WWF San Felice',
    provincia: 'Grosseto', comune: 'Grosseto',
    lat: 42.7178500, lon: 10.9810013,
    posPrecisione: 'area_approssimata',
    posNota: "Coordinata al livello della località Marina di Grosseto: indirizzo puntuale (Via Costiera) non geocodificabile con precisione.",
    descrizione: `Area protetta di 47,7 ettari lungo la costa tra Marina di Grosseto e Castiglione della Pescaia, nata dalla collaborazione tra il gruppo Allianz (proprietario dei terreni) e il WWF. La ghiandaia marina è la specie simbolo, nidificante anche grazie alle cassette-nido installate dai volontari WWF.`,
    specie: ['Ghiandaia marina', 'Uccelli acquatici (specie da verificare)'],
    periodo: ['da verificare (probabile primavera-estate per la nidificazione)'],
    prenotazione: true,
    prezzo: 'da verificare',
    comeArrivare: `Via Costiera, Marina di Grosseto (GR), lungo la costa verso Castiglione della Pescaia.`,
    telefono: '375 5828328', email: 'info@silvacoop.com', sito: 'https://www.wwf.it/dove-interveniamo/il-nostro-lavoro-in-italia/oasi/oasi-san-felice/',
    gestore: 'WWF Italia (Oasi Affiliata, Allianz Group)', accessibilita: 'da verificare',
    fonte: 'https://www.wwf.it/dove-interveniamo/il-nostro-lavoro-in-italia/oasi/oasi-san-felice/',
    stato: 'da_verificare',
    note: 'Elenco specie e periodo migliore incompleti nelle fonti consultate.',
    foto: { autore: 'Legione899 (Wikimedia Commons)', licenza: 'CC BY-SA 4.0', data: '2016-09-18', alt: "Il canale San Leopoldo nell'Oasi di San Felice", sulPosto: true },
  },
  {
    id: 'riserva-naturale-del-chiarone-oasi-massaciuccoli',
    nome: 'Riserva naturale del Chiarone (Oasi Massaciuccoli)',
    provincia: 'Lucca', comune: 'Massarosa',
    lat: 43.8655940, lon: 10.3386981,
    descrizione: `Riserva LIPU di 47 ettari sulla sponda orientale del Lago di Massaciuccoli, famosa per il birdwatching fin dall'Ottocento. Circa 300 specie di uccelli documentate: aironi (cenerino, bianco maggiore, guardabuoi), avocette, chiurli, piro piro, falchi di palude, falchi pescatori e diverse sterne. Una passerella in legno di 800 metri conduce a 4 punti di osservazione, accessibile anche a persone con disabilità.`,
    specie: ['Airone cenerino', 'Airone bianco maggiore', 'Avocetta', 'Chiurlo', 'Falco di palude', 'Falco pescatore', 'Tarabuso'],
    periodo: ['marzo-aprile (migrazione)'],
    prenotazione: false,
    prezzo: 'ingresso gratuito',
    comeArrivare: `Via del Porto 154, 55054 Massarosa (LU).`,
    telefono: '0584 975567', email: 'oasi.massaciuccoli@lipu.it', sito: 'https://www.lipu.it/oasi-riserve/riserva-naturale-chiarone-oasi-massaciuccoli',
    gestore: 'LIPU', accessibilita: 'passerella accessibile a persone con disabilità',
    fonte: 'https://www.lipu.it/oasi-riserve/riserva-naturale-chiarone-oasi-massaciuccoli',
    stato: 'verificato',
    note: '',
    foto: { autore: 'PROPOLI87 (Wikimedia Commons)', licenza: 'CC BY-SA 4.0', data: '2019-12-20', alt: 'Il Lago di Massaciuccoli presso Torre del Lago Puccini', sulPosto: true },
  },
  {
    id: 'riserva-naturale-santa-luce',
    nome: 'Riserva naturale Santa Luce',
    provincia: 'Pisa', comune: 'Santa Luce',
    lat: 43.4665473, lon: 10.5467537,
    posPrecisione: 'area_approssimata',
    posNota: 'Coordinata al livello del comune: indirizzo puntuale (Via Rosignanina 67) non geocodificabile con precisione.',
    descrizione: `Riserva LIPU sul lago artificiale di Santa Luce, con oltre 180 specie di uccelli documentate. Lo svasso maggiore è il simbolo della riserva; tra gli svernanti moriglione, alzavola, germano reale e cormorano; tra i nidificanti estivi cannareccione, cannaiola e gruccione. Rapaci presenti tutto l'anno: gheppio, poiana, falco di palude, barbagianni e civetta.`,
    specie: ['Svasso maggiore', 'Moriglione', 'Alzavola', 'Gruccione', 'Falco di palude', 'Barbagianni', 'Cannareccione'],
    periodo: ['primavera (corteggiamento svasso maggiore)'],
    prenotazione: false,
    prezzo: '5 € intero (dato da riconfermare)',
    comeArrivare: `Via Rosignanina 67, 56040 Santa Luce (PI). Da Pisa: SS206 verso Cecina, poi SP51 Rosignanina per 2 km.`,
    telefono: '344 0858799', email: 'riserva.santaluce@lipu.it', sito: 'https://www.lipu.it/oasi-riserve/riserva-naturale-santa-luce',
    gestore: 'LIPU', accessibilita: 'percorso semplice, scarpe da trekking consigliate',
    fonte: 'https://www.lipu.it/oasi-riserve/riserva-naturale-santa-luce',
    stato: 'verificato',
    note: '',
    foto: { autore: 'Brax14 (Wikimedia Commons)', licenza: 'CC BY-SA 4.0', data: '2019-06-28', alt: 'Il lago di Santa Luce', sulPosto: true },
  },
  {
    id: 'riserva-naturale-padule-di-fucecchio',
    nome: 'Riserva naturale Padule di Fucecchio',
    provincia: 'Pistoia', comune: 'Larciano',
    lat: 43.8229338, lon: 10.8381910,
    posPrecisione: 'area_approssimata',
    posNota: "Coordinata sulla strada di accesso (zona Castelmartini): l'indirizzo esatto della riserva non è geocodificabile con precisione da fonti aperte.",
    descrizione: `La più grande palude interna d'Italia (1.800 ettari), gestita da LIPU dal 2024, con oltre 240 specie di uccelli documentate: airone rosso, tarabuso, spatola e mestolone tra le specie di maggior pregio conservazionistico. L'osservatorio faunistico "Le Morette" è sempre visitabile liberamente dall'esterno, con personale LIPU e cannocchiali nei weekend estivi.`,
    specie: ['Airone rosso', 'Tarabuso', 'Spatola', 'Mestolone', 'Falco di palude'],
    periodo: ['ottobre-maggio'],
    prenotazione: false,
    prezzo: 'ingresso gratuito (osservatorio Le Morette)',
    comeArrivare: `Via Castelmartini 115, Larciano (PT).`,
    telefono: '0573 84540', email: 'riserva.fucecchio@lipu.it', sito: 'https://www.lipu.it/oasi-riserve/riserva-naturale-padule-fucecchio',
    gestore: 'LIPU', accessibilita: 'osservatorio Le Morette sempre accessibile dall\'esterno',
    fonte: 'https://www.lipu.it/oasi-riserve/riserva-naturale-padule-fucecchio',
    stato: 'verificato',
    note: '',
    foto: { autore: 'FeliceFlorio (Wikimedia Commons)', licenza: 'CC BY-SA 4.0', data: '2020-05-28', alt: 'Lepre selvatica nella Riserva Naturale Padule di Fucecchio', sulPosto: true },
  },
  {
    id: 'riserva-naturale-lago-di-sibolla',
    nome: 'Riserva naturale Lago di Sibolla',
    provincia: 'Lucca', comune: 'Altopascio',
    lat: 43.8240648, lon: 10.6941163,
    posPrecisione: 'area_approssimata',
    posNota: "Coordinata sulla via di accesso (zona industriale Altopascio): l'indirizzo esatto della riserva non è geocodificabile con precisione.",
    descrizione: `Riserva LIPU di 64 ettari su un piccolo lago costiero relitto, sito Ramsar dal 1996. 147 specie di uccelli documentate, con una garzaia che ospita 11 specie e oltre 1.200 coppie riproduttive; presenti anche spatole, nitticore, tarabusini, falchi di palude, martin pescatore e la testuggine palustre europea.`,
    specie: ['Nitticora', 'Tarabusino', 'Falco di palude', 'Martin pescatore', 'Testuggine palustre europea'],
    periodo: ['primavera-estate (garzaia attiva)'],
    prenotazione: true,
    prezzo: 'da verificare',
    comeArrivare: `Via dei Sandroni 15, 55011 Altopascio (LU), 2 km dal casello A11 di Altopascio.`,
    telefono: '328 9291177', email: 'riserva.sibolla@lipu.it', sito: 'https://www.lipu.it/oasi-riserve/riserva-naturale-lago-sibolla',
    gestore: 'LIPU', accessibilita: 'da verificare',
    fonte: 'https://www.lipu.it/oasi-riserve/riserva-naturale-lago-sibolla',
    stato: 'verificato',
    note: '',
    foto: { autore: 'Carnby (Wikimedia Commons)', licenza: 'CC BY 3.0', data: '2009-03-15', alt: 'Il Lago di Sibolla', sulPosto: true },
  },
];

const dir = new URL('../data/toscana/', import.meta.url);
mkdirSync(dir, { recursive: true });

for (const l of luoghi) {
  const immagineBlock = l.foto
    ? `immagine:
  file: ./foto/${l.id}.jpg
  alt: ${y(l.foto.alt)}
  autore: ${y(l.foto.autore)}
  licenza: ${y(l.foto.licenza)}
  data_scatto: ${l.foto.data}
  scattata_sul_posto: ${l.foto.sulPosto}
`
    : '';

  const contenuto = `id: ${l.id}
nome: ${y(l.nome)}
tipo: oasi_riserva
regione: Toscana
provincia: ${y(l.provincia)}
comune: ${y(l.comune)}
posizione:
  precisione: ${l.posPrecisione || 'esatta'}
  lat: ${l.lat}
  lon: ${l.lon}
  nota_precisione: ${l.posNota ? y(l.posNota) : '""'}
descrizione: ${block(l.descrizione)}
specie_principali:${arr(l.specie)}
periodo_migliore:${arr(l.periodo)}
prenotazione_necessaria: ${l.prenotazione}
prezzo_indicativo: ${y(l.prezzo)}
come_arrivare: ${block(l.comeArrivare)}
contatti:
  telefono: ${y(l.telefono)}
  email: ${y(l.email)}
  sito_ufficiale: ${y(l.sito)}
gestore: ${y(l.gestore)}
accessibilità: ${y(l.accessibilita)}
${immagineBlock}fonte: ${y(l.fonte)}
ultima_verifica: ${oggi}
stato_affidabilità: ${l.stato}
note_interne: ${l.note ? block(l.note) : '""'}
`;

  writeFileSync(new URL(`${l.id}.yaml`, dir), contenuto);
}

console.log(`Scritte ${luoghi.length} schede in data/toscana/`);
