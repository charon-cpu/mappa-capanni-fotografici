/**
 * Configurazione unica del sito. Cambia qui nome ed email di contatto:
 * si propagano automaticamente a header, footer, pagina Contatti e Segnala.
 */
export const SITE = {
  /**
   * PROVVISORIO: nome del sito non ancora deciso da Francesco.
   * Cambia solo questa stringa quando è scelto (vedi REPORT.md per alternative).
   */
  name: 'Capanni Italia',
  tagline: 'Capanni fotografici e oasi naturalistiche in Italia',
  contactEmail: 'info@francescocaimophoto.it',
} as const;
