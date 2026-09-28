import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const luoghi = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './data' }),
  schema: ({ image }) => z.object({
    id: z.string(),
    nome: z.string(),
    tipo: z.enum(['capanno_fotografico', 'osservatorio_birdwatching', 'oasi_riserva']),
    regione: z.string(),
    provincia: z.string(),
    comune: z.string(),
    posizione: z.object({
      precisione: z.enum(['esatta', 'area_approssimata']),
      lat: z.number(),
      lon: z.number(),
      nota_precisione: z.string().optional().default(''),
    }),
    descrizione: z.string(),
    specie_principali: z.array(z.string()),
    periodo_migliore: z.array(z.string()),
    // null = non ancora verificato (schede pubblicate in blocco, in attesa
    // di conferma diretta col gestore): l'interfaccia mostra "da verificare"
    // invece di affermare necessaria/non necessaria senza saperlo davvero.
    prenotazione_necessaria: z.boolean().nullable(),
    prezzo_indicativo: z.string(),
    come_arrivare: z.string(),
    contatti: z.object({
      telefono: z.string(),
      email: z.string(),
      sito_ufficiale: z.string(),
    }),
    gestore: z.string(),
    'accessibilità': z.string(),
    // Foto pertinente alla scheda (facoltativa: una scheda senza foto non
    // deve bloccare la build). "scattata_sul_posto: false" indica che la
    // foto mostra la specie/l'ambiente ma non è stata scattata in quel
    // preciso luogo: la didascalia lo renderà esplicito.
    immagine: z
      .object({
        file: image(),
        alt: z.string(),
        autore: z.string(),
        licenza: z.string(),
        data_scatto: z.coerce.date().optional(),
        scattata_sul_posto: z.boolean(),
      })
      .optional(),
    fonte: z.string(),
    ultima_verifica: z.coerce.date(),
    'stato_affidabilità': z.enum(['verificato', 'da_verificare', 'segnalato_obsoleto']),
    note_interne: z.string().optional().default(''),
  }),
});

export const collections = { luoghi };
