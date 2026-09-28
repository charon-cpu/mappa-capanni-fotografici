// Corregge i luoghi finiti sulla stessa coordinata "regione generica" per
// via di un match Photon poco specifico. Riprova con query più mirate e
// rifiuta un risultato se coincide esattamente con la coordinata generica
// che stiamo cercando di evitare.
import { readFileSync, writeFileSync } from 'node:fs';
import yaml from 'js-yaml';

const BERSAGLI = [
  { file: 'data/campania/la-punta-oasi-blu-affiliata-wwf.yaml', evitare: [40.860672, 14.843984] },
  { file: 'data/campania/oasi-wwf-bosco-camerine.yaml', evitare: [40.860672, 14.843984] },
  { file: 'data/campania/oasi-wwf-bosco-di-san-silvestro.yaml', evitare: [40.860672, 14.843984] },
  { file: 'data/campania/oasi-wwf-cratere-degli-astroni.yaml', evitare: [40.860672, 14.843984] },
  { file: 'data/campania/oasi-wwf-di-persano.yaml', evitare: [40.860672, 14.843984] },
  { file: 'data/campania/oasi-wwf-diecimare.yaml', evitare: [40.860672, 14.843984] },
  { file: 'data/campania/oasi-wwf-grotte-del-bussento.yaml', evitare: [40.860672, 14.843984] },
  { file: 'data/campania/oasi-zone-umide-beneventane.yaml', evitare: [40.860672, 14.843984] },
  { file: 'data/emilia-romagna/oasi-dei-ghirardi.yaml', evitare: [44.525696, 11.039437] },
  { file: 'data/emilia-romagna/oasi-wwf-marmirolo.yaml', evitare: [44.525696, 11.039437] },
  { file: 'data/emilia-romagna/oasi-wwf-poviglio.yaml', evitare: [44.525696, 11.039437] },
];

function y(v) {
  const s = String(v);
  return `"${s.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`;
}

async function photonSearch(query) {
  const url = new URL('https://photon.komoot.io/api/');
  url.searchParams.set('q', query);
  url.searchParams.set('limit', '3');
  const res = await fetch(url, {
    headers: { 'User-Agent': 'mappa-capanni-fotografici/1.0 (contatto: francescocaimo23@gmail.com)' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return (json.features || []).map((f) => ({
    lat: f.geometry.coordinates[1],
    lon: f.geometry.coordinates[0],
    comune: f.properties.city || f.properties.county || null,
    provincia: f.properties.county || null,
    label: f.properties.name,
  }));
}

function vicino(a, b, eps = 0.0005) {
  return Math.abs(a[0] - b[0]) < eps && Math.abs(a[1] - b[1]) < eps;
}

for (const bersaglio of BERSAGLI) {
  const fileUrl = new URL(`../${bersaglio.file}`, import.meta.url);
  const raw = readFileSync(fileUrl, 'utf8');
  const parsed = yaml.load(raw);
  console.log(`\n${parsed.nome} (${parsed.regione})`);

  const tentativi = [parsed.nome, `${parsed.nome} Italia`, `${parsed.nome}, ${parsed.provincia !== 'da verificare' ? parsed.provincia : parsed.regione}`];
  let trovato = null;
  for (const q of tentativi) {
    try {
      const risultati = await photonSearch(q);
      const buono = risultati.find((r) => !vicino([r.lat, r.lon], bersaglio.evitare));
      if (buono) {
        trovato = { ...buono, query: q };
        break;
      }
    } catch (e) {
      console.error('  errore', q, e.message);
    }
    await new Promise((r) => setTimeout(r, 1000));
  }

  if (trovato) {
    const nuovaNota = `Posizione del punto d'interesse "${trovato.label || parsed.nome}" (query: "${trovato.query}") trovato su OpenStreetMap: da confermare comunque con l'indirizzo esatto del gestore.`;
    let nuovo = raw
      .replace(/lat: [\d.\-]+/, `lat: ${trovato.lat}`)
      .replace(/lon: [\d.\-]+/, `lon: ${trovato.lon}`)
      .replace(/nota_precisione: ".*?"/s, `nota_precisione: ${y(nuovaNota)}`);
    if (parsed.comune === 'da verificare' && trovato.comune) {
      nuovo = nuovo.replace(/^comune: "da verificare"/m, `comune: ${y(trovato.comune)}`);
    }
    if (parsed.provincia === 'da verificare' && trovato.provincia) {
      nuovo = nuovo.replace(/^provincia: "da verificare"/m, `provincia: ${y(trovato.provincia)}`);
    }
    writeFileSync(fileUrl, nuovo);
    console.log('  -> CORRETTO:', trovato.query, trovato.lat, trovato.lon);
  } else {
    console.log('  -> nessuna alternativa trovata, resta la coordinata regionale condivisa');
  }
}
