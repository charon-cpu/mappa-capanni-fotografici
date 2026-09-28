import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const luoghi = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './data' }),
  schema: z.object({
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
    prenotazione_necessaria: z.boolean(),
    prezzo_indicativo: z.string(),
    come_arrivare: z.string(),
    contatti: z.object({
      telefono: z.string(),
      email: z.string(),
      sito_ufficiale: z.string(),
    }),
    gestore: z.string(),
    'accessibilità': z.string(),
    immagini: z.array(z.object({ url: z.string(), credit: z.string() })).default([]),
    fonte: z.string(),
    ultima_verifica: z.coerce.date(),
    'stato_affidabilità': z.enum(['verificato', 'da_verificare', 'segnalato_obsoleto']),
    note_interne: z.string().optional().default(''),
  }),
});

export const collections = { luoghi };
