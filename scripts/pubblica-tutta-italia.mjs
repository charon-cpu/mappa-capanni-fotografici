// Pubblica TUTTI i candidati rimasti in dati/bozze/ come schede reali in
// data/{regione}/, usando i fatti già verificati nella bozza (nome, comune,
// gestore, fonte, tipo) e geocodificando ogni comune via Nominatim per una
// posizione approssimata onesta. Tutto il resto (prezzo, orari, specie,
// descrizione, contatti) resta "da verificare": nessun dato inventato.
import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync } from 'node:fs';
import yaml from 'js-yaml';

const BOZZE_DIR = new URL('../dati/bozze/', import.meta.url);
const DATA_DIR = new URL('../data/', import.meta.url);
const oggi = '2026-09-28';

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function geocodeComune(comune, provincia, regione) {
  const tentativi = [
    comune !== 'da verificare' ? `${comune}, ${provincia !== 'da verificare' ? provincia : ''}, Italia` : null,
    comune !== 'da verificare' ? `${comune}, ${regione}, Italia` : null,
    `${regione}, Italia`,
  ].filter(Boolean);

  for (const q of tentativi) {
    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('q', q);
    url.searchParams.set('format', 'json');
    url.searchParams.set('limit', '1');
    url.searchParams.set('countrycodes', 'it');
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'mappa-capanni-fotografici/1.0 (contatto: francescocaimo23@gmail.com)' },
      });
      const json = await res.json();
      if (json && json[0]) {
        return { lat: parseFloat(json[0].lat), lon: parseFloat(json[0].lon), query: q };
      }
    } catch (e) {
      console.error('geocode error', q, e.message);
    }
    await new Promise((r) => setTimeout(r, 1100));
  }
  return null;
}

function y(v) {
  if (v === null || v === undefined) return '""';
  const s = String(v);
  if (/^[a-zA-Z0-9_.\-]+$/.test(s)) return s;
  return `"${s.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`;
}

const files = readdirSync(BOZZE_DIR).filter((f) => f.endsWith('.yaml'));
let totalePubblicati = 0;
const riepilogo = [];

for (const file of files) {
  const raw = readFileSync(new URL(file, BOZZE_DIR), 'utf8');
  const parsed = yaml.load(raw);
  const candidati = parsed?.candidati || [];
  if (!candidati.length) continue;

  const regione = candidati[0].regione;
  const regioneSlug = slugify(regione);
  const outDir = new URL(`${regioneSlug}/`, DATA_DIR);
  mkdirSync(outDir, { recursive: true });

  let pubblicatiRegione = 0;

  for (const c of candidati) {
    const geo = await geocodeComune(c.comune, c.provincia, c.regione);
    const lat = geo ? geo.lat : 41.8719; // centro Italia come ultima ancora di sicurezza, mai dovrebbe servire
    const lon = geo ? geo.lon : 12.5674;
    const notaGeo = geo
      ? `Posizione approssimata al livello di "${geo.query}" (geocodifica automatica): non ancora verificata con l'indirizzo esatto del gestore.`
      : `Geocodifica non riuscita: posizione segnaposto al centro Italia, DA CORREGGERE prima di qualunque uso pratico.`;

    const contenuto = `id: ${c.id}
nome: ${y(c.nome)}
tipo: ${c.tipo}
regione: ${y(c.regione)}
provincia: ${y(c.provincia === 'da verificare' ? 'da verificare' : c.provincia)}
comune: ${y(c.comune === 'da verificare' ? 'da verificare' : c.comune)}
posizione:
  precisione: area_approssimata
  lat: ${lat}
  lon: ${lon}
  nota_precisione: ${y(notaGeo)}
descrizione: ${y('Scheda pubblicata a partire da una fonte ufficiale (' + c.gestore + '), in attesa di verifica completa: descrizione dettagliata non ancora scritta. Fonte e gestore sono reali e verificati; prezzo, orari, specie e indirizzo esatto restano da confermare.')}
specie_principali: []
periodo_migliore:
  - "da verificare"
prenotazione_necessaria: null
prezzo_indicativo: "da verificare"
come_arrivare: ${y(`${c.comune !== 'da verificare' ? c.comune : ''}${c.provincia !== 'da verificare' ? ' (' + c.provincia + ')' : ''}, ${c.regione}. Indirizzo esatto da verificare sulla fonte ufficiale.`)}
contatti:
  telefono: "da verificare"
  email: "da verificare"
  sito_ufficiale: ${y(c.fonte)}
gestore: ${y(c.gestore)}
accessibilità: "da verificare"
fonte: ${y(c.fonte)}
ultima_verifica: ${c.data_consultazione || oggi}
stato_affidabilità: da_verificare
note_interne: ${y(`Pubblicata in blocco da bozza (affidabilità originaria: ${c.affidabilita}). Prezzo/orari/specie/descrizione/indirizzo esatto NON verificati: completare prima di considerarla una scheda di riferimento.`)}
`;
    writeFileSync(new URL(`${c.id}.yaml`, outDir), contenuto);
    pubblicatiRegione++;
    totalePubblicati++;
  }

  riepilogo.push(`${regione}: ${pubblicatiRegione}`);
  // la bozza è stata completamente pubblicata: rimuovo il file
  rmSync(new URL(file, BOZZE_DIR));
}

console.log(`\nPubblicati ${totalePubblicati} luoghi in ${riepilogo.length} regioni:`);
for (const r of riepilogo) console.log(' -', r);
