// Maps a technology label (as written in projects / skills) to an icon, so
// visitors who only scroll can read the stack at a glance.
// Brand logos come from Devicon (pinned version); generic concepts use Font Awesome.

export interface TechIcon {
  src?: string; // brand logo (SVG URL)
  fa?: string;  // Font Awesome class
}

const DEVICON = 'https://cdn.jsdelivr.net/npm/devicon@2.16.0/icons';
const dev = (name: string, variant = 'original'): TechIcon => ({ src: `${DEVICON}/${name}/${name}-${variant}.svg` });

// Checked in order: the first keyword found in the label (lower-cased) wins.
const RULES: [string, TechIcon][] = [
  ['flutter', dev('flutter')],
  ['dart', dev('dart')],
  ['firebase', dev('firebase')],
  ['angular', dev('angular')],
  ['rxjs', dev('rxjs')],
  ['react', dev('react')],
  ['vite', dev('vitejs')],
  ['typescript', dev('typescript')],
  ['node', dev('nodejs')],
  ['express', dev('express')],
  ['mongodb', dev('mongodb')],
  ['workers ai', { fa: 'fa-solid fa-microchip' }],
  ['workers', dev('cloudflareworkers')],
  ['cloudflare', dev('cloudflare')],
  ['pages functions', dev('cloudflareworkers')],
  ['github', dev('github')],
  ['git', dev('git')],
  ['google maps', { fa: 'fa-solid fa-map-location-dot' }],
  ['gemini', dev('google')],
  ['whatsapp', { fa: 'fa-brands fa-whatsapp' }],
  ['google play', { fa: 'fa-brands fa-google-play' }],
  ['play store', { fa: 'fa-brands fa-google-play' }],
  ['chart', { fa: 'fa-solid fa-chart-line' }],
  ['llama', { fa: 'fa-solid fa-robot' }],
  ['llm', { fa: 'fa-solid fa-robot' }],
  ['prompt', { fa: 'fa-solid fa-wand-magic-sparkles' }],
  ['ocr', { fa: 'fa-solid fa-file-image' }],
  ['clictopay', { fa: 'fa-solid fa-credit-card' }],
  ['payment', { fa: 'fa-solid fa-credit-card' }],
  ['instal', { fa: 'fa-solid fa-credit-card' }],
  ['websocket', { fa: 'fa-solid fa-plug' }],
  ['streaming', { fa: 'fa-solid fa-bolt' }],
  ['call', { fa: 'fa-solid fa-phone' }],
  ['messaging', { fa: 'fa-solid fa-comments' }],
  ['push', { fa: 'fa-solid fa-bell' }],
  ['location', { fa: 'fa-solid fa-location-crosshairs' }],
  ['i18n', { fa: 'fa-solid fa-language' }],
  ['multilingual', { fa: 'fa-solid fa-language' }],
  ['matching', { fa: 'fa-solid fa-route' }],
  ['rest', { fa: 'fa-solid fa-server' }],
  ['cron', { fa: 'fa-solid fa-clock' }],
  ['security', { fa: 'fa-solid fa-shield-halved' }],
  ['responsive', { fa: 'fa-solid fa-mobile-screen' }],
  ['seo', { fa: 'fa-solid fa-magnifying-glass' }],
];

const FALLBACK: TechIcon = { fa: 'fa-solid fa-code' };

export function techIcon(label: string): TechIcon {
  const l = label.toLowerCase();
  for (const [key, icon] of RULES) if (l.includes(key)) return icon;
  return FALLBACK;
}
