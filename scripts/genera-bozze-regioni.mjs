// Script una-tantum: genera i file di bozza /dati/bozze/{regione}.yaml a
// partire dai dati raccolti da fonti ufficiali (WWF, LIPU) durante la
// ricerca del blocco C. Ogni bozza contiene SOLO i fatti verificati sulla
// fonte indicata: il resto resta "da verificare". Nessuna scheda qui viene
// pubblicata (published: false) e nessuna di queste entra nella build.
import { writeFileSync } from 'node:fs';

const DATA_CONSULTAZIONE = '2026-09-28';

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// regione -> array di candidati
const regioni = {
  Piemonte: [
    { nome: 'Cascina Bellezza', gestore: 'WWF Italia (Oasi Affiliata)', fonte: 'https://www.parks.it/wwf/?reg=1', affidabilita: 'alta' },
    { nome: 'Forteto della Luja', gestore: 'WWF Italia (Oasi Affiliata)', fonte: 'https://www.parks.it/wwf/?reg=1', affidabilita: 'alta' },
    { nome: 'Oasi WWF Valmanera', gestore: 'WWF Italia', fonte: 'https://www.parks.it/wwf/?reg=1', affidabilita: 'alta' },
    { nome: 'Riserva naturale Crava Morozzo', gestore: 'LIPU', fonte: 'https://www.lipu.it/oasi-riserve', affidabilita: 'alta' },
  ],
  Lombardia: [
    { nome: 'Oasi WWF Bosco di Vanzago', gestore: 'WWF Italia', fonte: 'https://www.parks.it/wwf/?reg=3', affidabilita: 'alta' },
    { nome: 'Oasi WWF Valpredina', gestore: 'WWF Italia', fonte: 'https://www.parks.it/wwf/?reg=3', affidabilita: 'alta' },
    { nome: 'Galbusera Bianca', gestore: 'WWF Italia (Oasi Affiliata)', fonte: 'https://www.parks.it/wwf/?reg=3', affidabilita: 'alta' },
    { nome: 'Riserva naturale Palude Brabbia', gestore: 'LIPU', fonte: 'https://www.lipu.it/oasi-riserve', affidabilita: 'alta' },
    { nome: 'Riserva naturale Bosco Negri', gestore: 'LIPU', fonte: 'https://www.lipu.it/oasi-riserve', affidabilita: 'alta' },
    { nome: 'Oasi Cesano Maderno', gestore: 'LIPU', fonte: 'https://www.lipu.it/oasi-riserve', affidabilita: 'alta' },
    { nome: 'Riserva naturale Paludi di Ostiglia', gestore: 'LIPU', fonte: 'https://www.lipu.it/oasi-riserve', affidabilita: 'alta' },
    { nome: 'Oasi Bosco Vignolo', gestore: 'LIPU', fonte: 'https://www.lipu.it/oasi-riserve', affidabilita: 'alta' },
  ],
  'Trentino-Alto Adige': [
    { nome: 'Oasi WWF Inghiaie', gestore: 'WWF Italia', fonte: 'https://www.parks.it/wwf/?reg=4', affidabilita: 'alta' },
    { nome: 'Oasi WWF Valtrigona', gestore: 'WWF Italia', fonte: 'https://www.parks.it/wwf/?reg=4', affidabilita: 'alta' },
  ],
  'Friuli Venezia Giulia': [
    { nome: 'Riserva Marina di Miramare', gestore: 'WWF Italia', tipo_nota: 'area marina protetta', fonte: 'https://www.parks.it/wwf/?reg=6', affidabilita: 'alta' },
  ],
  Toscana: [
    { nome: 'Oasi WWF Padule Orti-Bottagone', gestore: 'WWF Italia', fonte: 'https://www.parks.it/wwf/?reg=9', affidabilita: 'alta' },
    { nome: 'Oasi WWF Lago di Burano', gestore: 'WWF Italia', fonte: 'https://www.parks.it/wwf/?reg=9', affidabilita: 'alta' },
    { nome: 'Capra Matilda', gestore: 'WWF Italia (Oasi Affiliata)', fonte: 'https://www.parks.it/wwf/?reg=9', affidabilita: 'alta' },
    { nome: 'Dynamo', gestore: 'WWF Italia (Oasi Affiliata)', fonte: 'https://www.parks.it/wwf/?reg=9', affidabilita: 'alta' },
    { nome: 'Gabbianello', gestore: 'WWF Italia (Oasi Affiliata)', fonte: 'https://www.parks.it/wwf/?reg=9', affidabilita: 'alta' },
    { nome: 'Oasi WWF Bosco Rocconi', gestore: 'WWF Italia', fonte: 'https://www.parks.it/wwf/?reg=9', affidabilita: 'alta' },
    { nome: 'Oasi WWF Laguna di Orbetello di Ponente', gestore: 'WWF Italia', fonte: 'https://www.parks.it/wwf/?reg=9', affidabilita: 'alta' },
    { nome: 'Padule di Bolgheri', gestore: 'WWF Italia (Oasi Affiliata)', fonte: 'https://www.parks.it/wwf/?reg=9', affidabilita: 'alta' },
    { nome: 'San Felice', gestore: 'WWF Italia (Oasi Affiliata)', fonte: 'https://www.parks.it/wwf/?reg=9', affidabilita: 'alta' },
    { nome: 'Riserva naturale del Chiarone (Oasi Massaciuccoli)', gestore: 'LIPU', fonte: 'https://www.lipu.it/oasi-riserve', affidabilita: 'alta' },
    { nome: 'Riserva naturale Santa Luce', gestore: 'LIPU', fonte: 'https://www.lipu.it/oasi-riserve', affidabilita: 'alta' },
    { nome: 'Riserva naturale Padule di Fucecchio', gestore: 'LIPU', fonte: 'https://www.lipu.it/oasi-riserve', affidabilita: 'alta' },
    { nome: 'Riserva naturale Lago di Sibolla', gestore: 'LIPU', fonte: 'https://www.lipu.it/oasi-riserve', affidabilita: 'alta' },
  ],
  Umbria: [
    { nome: 'Oasi WWF Lago di Alviano', gestore: 'WWF Italia', fonte: 'https://www.parks.it/wwf/?reg=10', affidabilita: 'alta' },
  ],
  Marche: [
    { nome: 'Oasi WWF Ripa Bianca di Jesi', gestore: 'WWF Italia', fonte: 'https://www.parks.it/wwf/?reg=11', affidabilita: 'alta' },
    { nome: 'Riserva naturale statale Montagna di Torricchio', gestore: 'WWF Italia', fonte: 'https://www.parks.it/wwf/?reg=11', affidabilita: 'alta' },
  ],
  Lazio: [
    { nome: "Oasi WWF Bosco Foce dell'Arrone", gestore: 'WWF Italia', fonte: 'https://www.parks.it/wwf/?reg=12', affidabilita: 'alta' },
    { nome: 'Oasi WWF Forre di Corchiano', gestore: 'WWF Italia', fonte: 'https://www.parks.it/wwf/?reg=12', affidabilita: 'alta' },
    { nome: 'Oasi WWF Macchiagrande', gestore: 'WWF Italia', fonte: 'https://www.parks.it/wwf/?reg=12', affidabilita: 'alta' },
    { nome: 'Oasi WWF Pian Sant\'Angelo', gestore: 'WWF Italia', fonte: 'https://www.parks.it/wwf/?reg=12', affidabilita: 'alta' },
    { nome: 'Oasi WWF Vasche di Maccarese', gestore: 'WWF Italia', fonte: 'https://www.parks.it/wwf/?reg=12', affidabilita: 'alta' },
    { nome: 'Castel Romano (Oasi WWF)', gestore: 'WWF Italia', fonte: 'https://www.wwf.it/dove-interveniamo/il-nostro-lavoro-in-italia/oasi/', affidabilita: 'alta' },
    { nome: 'Riserva Martignanello', gestore: 'WWF Italia', fonte: 'https://www.wwf.it/dove-interveniamo/il-nostro-lavoro-in-italia/oasi/', affidabilita: 'alta' },
    { nome: 'Oasi Castel di Guido', gestore: 'LIPU', fonte: 'https://www.lipu.it/oasi-riserve', affidabilita: 'alta' },
    { nome: 'Oasi Chm - Ostia', gestore: 'LIPU', fonte: 'https://www.lipu.it/oasi-riserve', affidabilita: 'alta' },
    { nome: 'Parco naturale Pantanello', gestore: 'LIPU', fonte: 'https://www.lipu.it/oasi-riserve', affidabilita: 'alta' },
  ],
  Abruzzo: [
    { nome: 'Lago di Penne (Oasi Affiliata WWF)', gestore: 'WWF Italia', fonte: 'https://www.parks.it/wwf/?reg=13', affidabilita: 'alta' },
  ],
  Molise: [
    { nome: 'Oasi WWF Guardiaregia - Campochiaro', gestore: 'WWF Italia', fonte: 'https://www.parks.it/wwf/?reg=14', affidabilita: 'alta' },
    { nome: 'Riserva naturale Bosco Casale (Oasi Casacalenda)', gestore: 'LIPU', fonte: 'https://www.lipu.it/oasi-riserve', affidabilita: 'alta' },
    { nome: 'Riserva naturale Rio Secco e Piana Palomba', gestore: 'LIPU', fonte: 'https://www.lipu.it/oasi-riserve', affidabilita: 'alta' },
  ],
  Campania: [
    { nome: 'Oasi WWF Cratere degli Astroni', gestore: 'WWF Italia', fonte: 'https://www.parks.it/wwf/?reg=15', affidabilita: 'alta' },
    { nome: 'La Punta (Oasi Blu Affiliata WWF)', gestore: 'WWF Italia', fonte: 'https://www.parks.it/wwf/?reg=15', affidabilita: 'alta' },
    { nome: 'Oasi WWF Bosco Camerine', gestore: 'WWF Italia', fonte: 'https://www.parks.it/wwf/?reg=15', affidabilita: 'alta' },
    { nome: 'Oasi WWF Bosco di San Silvestro', gestore: 'WWF Italia', fonte: 'https://www.parks.it/wwf/?reg=15', affidabilita: 'alta' },
    { nome: 'Oasi WWF di Persano', gestore: 'WWF Italia', fonte: 'https://www.parks.it/wwf/?reg=15', affidabilita: 'alta' },
    { nome: 'Oasi WWF Diecimare', gestore: 'WWF Italia', fonte: 'https://www.parks.it/wwf/?reg=15', affidabilita: 'alta' },
    { nome: 'Oasi WWF Grotte del Bussento', gestore: 'WWF Italia', fonte: 'https://www.parks.it/wwf/?reg=15', affidabilita: 'alta' },
    { nome: 'Oasi Soglitelle', comune: 'Villa Literno', provincia: 'Caserta', gestore: 'LIPU', fonte: 'https://www.lipu.it/oasi-riserve', affidabilita: 'alta' },
    { nome: 'Oasi Zone Umide Beneventane', gestore: 'LIPU', fonte: 'https://www.lipu.it/oasi-riserve', affidabilita: 'alta' },
  ],
  Puglia: [
    { nome: 'Oasi WWF Le Cesine', gestore: 'WWF Italia', fonte: 'https://www.parks.it/wwf/?reg=16', affidabilita: 'alta' },
    { nome: 'Oasi Lago Salso Manfredonia', gestore: 'WWF Italia', fonte: 'https://www.parks.it/wwf/?reg=16', affidabilita: 'alta' },
    { nome: "Oasi WWF Monte Sant'Elia", gestore: 'WWF Italia', fonte: 'https://www.parks.it/wwf/?reg=16', affidabilita: 'alta' },
    { nome: 'Oasi Gravina di Laterza', gestore: 'LIPU', fonte: 'https://www.lipu.it/oasi-riserve', affidabilita: 'alta' },
  ],
  Basilicata: [
    { nome: 'Oasi WWF Lago di San Giuliano', gestore: 'WWF Italia', fonte: 'https://www.parks.it/wwf/?reg=17', affidabilita: 'alta' },
  ],
  Sicilia: [
    { nome: 'Oasi WWF Capo Rama', gestore: 'WWF Italia', fonte: 'https://www.parks.it/wwf/?reg=19', affidabilita: 'alta' },
    { nome: 'Oasi WWF Lago Preola e Gorghi Tondi', gestore: 'WWF Italia', fonte: 'https://www.parks.it/wwf/?reg=19', affidabilita: 'alta' },
    { nome: 'Oasi WWF Saline di Trapani e Paceco', gestore: 'WWF Italia', fonte: 'https://www.parks.it/wwf/?reg=19', affidabilita: 'alta' },
    { nome: 'Oasi WWF Torre Salsa', gestore: 'WWF Italia', fonte: 'https://www.parks.it/wwf/?reg=19', affidabilita: 'alta' },
    { nome: 'Riserva naturale Biviere di Gela', gestore: 'LIPU', fonte: 'https://www.lipu.it/oasi-riserve', affidabilita: 'alta' },
    { nome: 'Riserva naturale Isola delle Femmine', gestore: 'LIPU', fonte: 'https://www.lipu.it/oasi-riserve', affidabilita: 'alta' },
    { nome: 'Riserva naturale Saline di Priolo', gestore: 'LIPU', fonte: 'https://www.lipu.it/oasi-riserve', affidabilita: 'alta' },
  ],
  Sardegna: [
    { nome: 'Oasi WWF Monte Arcosu', gestore: 'WWF Italia', fonte: 'https://www.parks.it/wwf/?reg=20', affidabilita: 'alta' },
    { nome: 'Oasi WWF Steppe Sarde', gestore: 'WWF Italia', fonte: 'https://www.parks.it/wwf/?reg=20', affidabilita: 'alta' },
    { nome: 'Oasi Carloforte', comune: 'Carloforte', provincia: 'Sud Sardegna', gestore: 'LIPU', fonte: 'https://www.lipu.it/oasi-riserve', affidabilita: 'alta' },
  ],
  Liguria: [
    { nome: 'Terre dei Bravin', comune: 'Mele', provincia: 'Genova', gestore: 'WWF Italia (Oasi Affiliata)', fonte: 'https://www.wwf.it/dove-interveniamo/il-nostro-lavoro-in-italia/oasi/', affidabilita: 'alta' },
    { nome: 'Oasi Valloni', comune: "Villanova d'Albenga", provincia: 'Savona', gestore: 'WWF Italia (WWF Savona)', fonte: 'https://www.wwf.it/chi-siamo/presenza-sul-territorio/liguria/', affidabilita: 'media' },
    { nome: 'Oasi Arcola', gestore: 'LIPU', fonte: 'https://www.lipu.it/oasi-riserve', affidabilita: 'alta' },
  ],
  'Emilia-Romagna': [
    { nome: 'Oasi dei Ghirardi', comune: 'Borgo Val di Taro e Albareto', provincia: 'Parma', gestore: 'WWF Italia', fonte: 'https://www.agraria.org/parchi/emiliaromagna/oasighirardi.htm', affidabilita: 'media' },
    { nome: 'Oasi WWF Marmirolo', provincia: 'Reggio Emilia', gestore: 'WWF Emilia Centrale', fonte: 'https://www.travelemiliaromagna.it/oasi-wwf-in-emilia-romagna/', affidabilita: 'media' },
    { nome: 'Oasi WWF Poviglio', provincia: 'Reggio Emilia', gestore: 'WWF Emilia Centrale', fonte: 'https://www.travelemiliaromagna.it/oasi-wwf-in-emilia-romagna/', affidabilita: 'media' },
    { nome: 'Oasi WWF Sassoguidano', comune: 'Pavullo nel Frignano', provincia: 'Modena', gestore: 'WWF Emilia Centrale', fonte: 'https://www.travelemiliaromagna.it/oasi-wwf-in-emilia-romagna/', affidabilita: 'media' },
    { nome: 'Oasi WWF Gregorina', comune: 'Castrocaro Terme e Terra del Sole', provincia: 'Forlì-Cesena', gestore: 'WWF Italia', fonte: 'https://www.travelemiliaromagna.it/oasi-wwf-in-emilia-romagna/', affidabilita: 'media' },
    { nome: "Oasi WWF Cà Brigida", comune: 'Verucchio', provincia: 'Rimini', gestore: 'WWF Italia', fonte: 'https://www.travelemiliaromagna.it/oasi-wwf-in-emilia-romagna/', affidabilita: 'media' },
    { nome: 'Oasi WWF Dune Fossili di Massenzatica', provincia: 'Ferrara', gestore: 'WWF Italia', fonte: 'https://www.travelemiliaromagna.it/oasi-wwf-in-emilia-romagna/', affidabilita: 'media' },
    { nome: 'Oasi Bianello', gestore: 'LIPU', fonte: 'https://www.lipu.it/oasi-riserve', affidabilita: 'alta' },
    { nome: 'Riserva naturale Torrile e Trecasali', gestore: 'LIPU', fonte: 'https://www.lipu.it/oasi-riserve', affidabilita: 'alta' },
    { nome: 'Oasi Celestina', gestore: 'LIPU', fonte: 'https://www.lipu.it/oasi-riserve', affidabilita: 'alta' },
  ],
  Calabria: [
    { nome: "Oasi WWF Lago dell'Angitola", gestore: 'WWF Italia', fonte: 'https://www.wwf.it/oasi/calabria/lago_dell_angitola/', affidabilita: 'alta' },
  ],
};

const noteSensibilita = '';

for (const [regione, candidati] of Object.entries(regioni)) {
  const regioneSlug = slugify(regione);
  const righe = candidati.map((c) => {
    const slug = slugify(c.nome);
    return `  - id: ${slug}
    nome: "${c.nome.replace(/"/g, '\\"')}"
    regione: "${regione}"
    comune: "${c.comune || 'da verificare'}"
    provincia: "${c.provincia || 'da verificare'}"
    tipo: oasi_riserva
    gestore: "${c.gestore}"
    fonte: "${c.fonte}"
    data_consultazione: "${DATA_CONSULTAZIONE}"
    affidabilita: ${c.affidabilita}
    published: false
    posizione:
      precisione: non_rilevata
      nota: "Coordinate non ancora raccolte: la bozza contiene solo i fatti verificati sulla fonte indicata (nome, comune se noto, gestore, tipo)."
    prezzo_indicativo: "da verificare"
    orari_periodo: "da verificare"
    specie_principali: []
    descrizione: "da verificare"
    note_interne: ""
`;
  }).join('\n');

  const contenuto = `# Bozza NON pubblicata — ${regione}
# Generata durante la ricerca del blocco C. Nessuna di queste schede entra
# nella build pubblica (vedi src/content.config.ts: legge solo data/, non
# dati/bozze/). Prima di pubblicare una voce: verificarla di persona sulla
# fonte ufficiale, completare tutti i campi "da verificare", raccogliere le
# coordinate e spostarla in data/${regioneSlug}/ seguendo lo schema in
# docs/schema-scheda.md.
candidati:
${righe}`;

  writeFileSync(new URL(`../dati/bozze/${regioneSlug}.yaml`, import.meta.url), contenuto);
  console.log(`scritto dati/bozze/${regioneSlug}.yaml (${candidati.length} candidati)`);
}
