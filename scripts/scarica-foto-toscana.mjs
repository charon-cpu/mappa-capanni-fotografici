// Script una-tantum: scarica le foto Wikimedia Commons selezionate per le
// schede Toscana, rimuove i metadati EXIF (incluso GPS) e le salva in
// data/toscana/foto/{id}.jpg pronte per essere referenziate dalle schede.
import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'node:fs';

const foto = [
  { id: 'oasi-wwf-padule-orti-bottagone', url: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Oasi_WWF_Orti-Bottagone.JPG' },
  { id: 'oasi-wwf-laguna-di-orbetello-di-ponente', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/2016-08-11_Riserva_naturale_Laguna_di_Orbetello_di_Ponente_02.jpg' },
  { id: 'padule-di-bolgheri', url: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Oasi_WWF_Padule_di_Bolgheri_%28LI%29_panoramica_zona_nord.jpg' },
  { id: 'san-felice', url: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Oasi_di_San_Felice_-_Fiumara.jpg' },
  { id: 'riserva-naturale-santa-luce', url: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Lago_di_Santa_Luce.jpg' },
  { id: 'riserva-naturale-del-chiarone-oasi-massaciuccoli', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Lago_di_Massaciuccoli_-_Torre_del_Lago_Puccini.jpg' },
  { id: 'oasi-wwf-bosco-rocconi', url: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Bosco_dei_Rocconi.jpg' },
  { id: 'riserva-naturale-padule-di-fucecchio', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Lepre_selvatica_nel_Padule_di_Fucecchio.jpg' },
  { id: 'riserva-naturale-lago-di-sibolla', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Lago_di_Sibolla.jpg' },
  { id: 'oasi-wwf-lago-di-burano', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Birdwatching_tra_i_canneti.jpg' },
  { id: 'gabbianello', url: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Vista_del_Lago_di_Bilancino_dall%27_Oasi_Gabbianello.jpg" },
];

const outDir = new URL('../data/toscana/foto/', import.meta.url);
mkdirSync(outDir, { recursive: true });

for (const f of foto) {
  const res = await fetch(f.url, { headers: { 'User-Agent': 'mappa-capanni-fotografici/1.0 (contatto: francescocaimo23@gmail.com)' } });
  if (!res.ok) {
    console.error('ERRORE', f.id, res.status);
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  // ridimensiona a una larghezza ragionevole e rimuove tutti i metadati
  // (sharp non copia l'exif in output a meno di withMetadata(), qui
  // esplicitamente NON lo richiamiamo)
  const processed = await sharp(buf)
    .rotate() // applica l'orientamento EXIF prima di scartarlo
    .resize({ width: 1600, withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer();
  writeFileSync(new URL(`${f.id}.jpg`, outDir), processed);
  const meta = await sharp(processed).metadata();
  console.log(f.id, '-> scaricata e ripulita, exif presente?', !!meta.exif, `(${(processed.length / 1024).toFixed(0)} KB)`);
}
