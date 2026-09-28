// Ri-geocodifica le schede finite sul fallback "centro Italia" a causa del
// rate-limit di Nominatim durante pubblica-tutta-italia.mjs. Usa Photon
// (komoot.io, dati OpenStreetMap ma infrastruttura separata da Nominatim),
// provando prima il nome del luogo stesso (spesso è un POI riconosciuto),
// poi comune+provincia, poi comune+regione, infine la sola regione.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import yaml from 'js-yaml';

const DATA_DIR = new URL('../data/', import.meta.url);
const FALLBACK_LAT = 41.8719;
const FALLBACK_LON = 12.5674;

function y(v) {
  const s = String(v);
  return `"${s.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`;
}

async function photonSearch(query) {
  const url = new URL('https://photon.komoot.io/api/');
  url.searchParams.set('q', query);
  url.searchParams.set('limit', '1');
  const res = await fetch(url, {
    headers: { 'User-Agent': 'mappa-capanni-fotografici/1.0 (contatto: francescocaimo23@gmail.com)' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const f = json.features && json.features[0];
  if (!f) return null;
  const [lon, lat] = f.geometry.coordinates;
  return {
    lat,
    lon,
    comune: f.properties.city || f.properties.county || null,
    provincia: f.properties.county || null,
  };
}

async function trovaPosizione(nome, comune, provincia, regione) {
  const tentativi = [
    { q: `${nome}, ${regione}, Italia`, precisa: true },
    comune !== 'da verificare' && provincia !== 'da verificare'
      ? { q: `${comune}, ${provincia}, Italia`, precisa: false }
      : null,
    comune !== 'da verificare' ? { q: `${comune}, ${regione}, Italia`, precisa: false } : null,
    { q: `${regione}, Italia`, precisa: false },
  ].filter(Boolean);

  for (const { q, precisa } of tentativi) {
    try {
      const r = await photonSearch(q);
      if (r) return { ...r, query: q, precisa };
    } catch (e) {
      console.error('  errore', q, '->', e.message);
    }
    await new Promise((res) => setTimeout(res, 1000));
  }
  return null;
}

const regioni = readdirSync(DATA_DIR, { withFileTypes: true }).filter((d) => d.isDirectory());
let corretti = 0;
let ancoraFalliti = [];

for (const regioneDir of regioni) {
  const dir = new URL(`${regioneDir.name}/`, DATA_DIR);
  const files = readdirSync(dir).filter((f) => f.endsWith('.yaml'));
  for (const file of files) {
    const fileUrl = new URL(file, dir);
    const raw = readFileSync(fileUrl, 'utf8');
    if (!raw.includes(`lat: ${FALLBACK_LAT}`)) continue;

    const parsed = yaml.load(raw);
    console.log(`Ri-geocodifico: ${parsed.nome} (${parsed.regione})`);
    const trovata = await trovaPosizione(parsed.nome, parsed.comune, parsed.provincia, parsed.regione);

    if (trovata) {
      const nuovaNota = trovata.precisa
        ? `Posizione del punto d'interesse "${trovata.query}" trovato su OpenStreetMap (geocodifica automatica): da confermare comunque con l'indirizzo esatto del gestore.`
        : `Posizione approssimata al livello di "${trovata.query}" (geocodifica automatica): non ancora verificata con l'indirizzo esatto del gestore.`;
      let nuovo = raw
        .replace(/lat: 41\.8719/, `lat: ${trovata.lat}`)
        .replace(/lon: 12\.5674/, `lon: ${trovata.lon}`)
        .replace(/nota_precisione: ".*?"/s, `nota_precisione: ${y(nuovaNota)}`);
      // se comune era "da verificare" e Photon l'ha identificato, lo riportiamo
      if (parsed.comune === 'da verificare' && trovata.comune) {
        nuovo = nuovo.replace(/^comune: "da verificare"/m, `comune: ${y(trovata.comune)}`);
      }
      if (parsed.provincia === 'da verificare' && trovata.provincia) {
        nuovo = nuovo.replace(/^provincia: "da verificare"/m, `provincia: ${y(trovata.provincia)}`);
      }
      writeFileSync(fileUrl, nuovo);
      console.log('  ->', trovata.query, trovata.lat, trovata.lon, trovata.precisa ? '(POI preciso)' : '(approssimato)');
      corretti++;
    } else {
      console.log('  -> ancora fallito, resta il segnaposto centro Italia');
      ancoraFalliti.push(`${regioneDir.name}/${file}`);
    }
  }
}

console.log(`\nCorretti ${corretti} luoghi.`);
if (ancoraFalliti.length) {
  console.log(`Ancora falliti (${ancoraFalliti.length}):`);
  ancoraFalliti.forEach((f) => console.log(' -', f));
}
