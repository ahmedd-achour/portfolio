import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AiChatComponent } from '../ai-chat/ai-chat.component';
import { techIcon } from './tech-icons';

interface CaseStudy {
  problem: string;
  built: string[];
  challenges: string[];
  results: string[];
}

export interface Project {
  title: string;
  category: string;
  image: string;
  link: string;
  linkLabel?: string;
  summary: string;
  description: string;
  tech: string[];
  metrics?: string[];
  gallery?: string[];
  caseStudy?: CaseStudy;
  featured?: boolean;
  video?: { src: string; poster: string; caption: string };
  architecture?: boolean;
}

const IMG = 'assets/img/projects/';
const range = (prefix: string, n: number) => Array.from({ length: n }, (_, i) => `${IMG}${prefix}-${i + 1}.webp`);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, AiChatComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  readonly linkedin = 'https://www.linkedin.com/in/ahmed-achour-3a695926a/';
  readonly github = 'https://github.com/ahmedd-achour';
  readonly whatsapp = 'https://wa.me/21694190332';

  readonly stats = [
    { value: '100K+', label: 'Downloads on FawaNews, my live-score app' },
    { value: '3', label: 'Apps I built and published on Google Play' },
    { value: '99.997%', label: 'Request success rate on my Cloudflare Workers APIs' },
    { value: '0.51 ms', label: 'Average CPU time per request at the edge' }
  ];

  readonly shnellCase: Project = {
    title: 'Shnell — on-demand transport platform',
    category: 'Case study · Founder & full-stack developer',
    image: `${IMG}shnell-client.webp`,
    link: 'https://play.google.com/store/apps/details?id=com.shnell.app',
    linkLabel: 'Get it on Google Play',
    featured: true,
    summary: 'Pick what you are moving, get an instant price across vehicle types, follow your load live and talk to the driver in-app. Two Flutter apps, an Angular dashboard and a real-time backend, built and shipped solo.',
    description: 'Shnell is the logistics startup I founded. I designed and built every part of it: the client app, the driver app, the admin dashboard and the backend that connects them in real time.',
    metrics: ['2 apps live on Google Play', 'v2.49 · Oct 2026', '78 Cloud Functions', 'Public API v1', 'Light & dark themes'],
    video: { src: 'assets/video/shnell-business.mp4', poster: 'assets/video/shnell-business-poster.jpg', caption: 'Shnell Business in 2 minutes (French): bulk trips, driver offers, live tracking and the public API.' },
    architecture: true,
    gallery: [...range('shnell-client', 9), ...range('shnell-driver', 3)],
    tech: ['Flutter', 'Firebase', 'Cloud Functions', 'Google Maps API', 'Agora', 'Angular', 'Cloudflare Workers'],
    caseStudy: {
      problem: 'In Tunisia, moving furniture or building materials still means calling around for a truck, negotiating the price by phone and having no idea where your load is. Drivers, on their side, lose hours waiting for work. Shnell turns that into a booking that takes under a minute, with a fair price and live tracking.',
      built: [
        'Client app (Flutter): pickup plus multiple stops, cargo category and a catalogue of 330+ items with weight estimates, so the app picks the right vehicle. Routes are ordered with Google Directions waypoint optimisation before the order is saved.',
        'Instant estimate across vehicle types (for example 27–44 TND for a 12.5 km move with a small van, pick-up or large van), with "now" or scheduled pickup.',
        'Driver app (Flutter): multi-step verification with document upload, an online/offline switch, incoming requests, offers, turn-by-turn navigation and an earnings dashboard by day, week and month.',
        'Return trips: drivers publish the empty leg of a long trip, and clients book it at a reduced price, so drivers no longer drive home empty.',
        'Shnell Business: company accounts with their own fleet, fleet invitations, business trips of up to 50 stops and a Pro plan.',
        'Public API v1 so a company’s website or ERP can book trips: hashed API keys, 120 requests per minute, idempotency keys, and HMAC-signed webhooks for every state change (searching, offers, assigned, delivered…).',
        'Smart dispatch (Cloud Functions): the search widens in radius tiers, 5 → 20 → 50 → 100 → 200 km, one tier every 36 s, and each tier only notifies drivers newly in range. Drivers accept the price or send a counter-offer, and the client picks one.',
        'Live tracking: the driver\'s position is streamed in the background, and the client sees a moving marker, ETA and distance until delivery.',
        'In-app voice calls, video calls and chat (Agora), so clients and drivers never need to share phone numbers.',
        'Angular admin dashboard to follow orders, drivers and revenue, and to configure regions, currencies and languages without shipping a new app.'
      ],
      challenges: [
        'Keeping orders, offers, deals and stops consistent across two apps on flaky mobile networks: critical state changes go through Firestore transactions and batched writes.',
        'Smooth maps on low-end Android phones: trip previews render maps in lite mode on Android instead of full interactive maps.',
        'Background location for drivers had to pass Google Play review: I built a prominent-disclosure permission flow and recorded the policy videos myself.',
        'Two codebases, one data model: shared models and a common schema document keep the client and driver apps in sync.',
        'One booking engine for every channel: the client app, Shnell Business and the public API all go through the same pricing, booking and dispatch functions, so a rule changes in one place.'
      ],
      results: [
        'Client and driver apps live on Google Play, updated regularly (latest release October 2026).',
        'Driver app launched in beta, onboarding the first verified drivers.',
        'A backend of 78 Cloud Functions covering pricing, dispatch, calls, fleets, plans, webhooks and admin tools.',
        'Multi-region from day one: a new country is a configuration change, not a rewrite.'
      ]
    }
  };

  readonly mobileProjects: Project[] = [
    {
      title: 'Shnell Driver',
      category: 'Mobile · Flutter · Real-time',
      image: `${IMG}shnell-driver.webp`,
      link: 'https://play.google.com/store/apps/details?id=com.shnell.shnell_driver',
      linkLabel: 'Get it on Google Play',
      summary: 'The partner app: go online, receive requests, send offers, publish return trips and track earnings. Live on Google Play.',
      description: 'The driver side of Shnell. Partners go through document verification, switch online, then receive nearby requests, send offers, navigate to each stop and call or message the client in-app. They can publish the empty return leg of a long trip for clients to book at a reduced price, join company fleets, and follow their earnings by day, week or month. Location is streamed in the background so clients and the admin dashboard see each trip live.',
      metrics: ['Live on Google Play', 'Return trips', 'Company fleets'],
      gallery: range('shnell-driver', 3),
      tech: ['Flutter', 'Firebase', 'Background location', 'Agora', 'Google Maps API']
    },
    {
      title: 'FawaNews — Live scores',
      category: 'Mobile · Flutter · Edge API',
      image: `${IMG}fawanews.webp`,
      link: 'https://play.google.com/store/apps/details?id=com.live.fawanews',
      linkLabel: 'Get it on Google Play',
      summary: 'Football live scores, leagues and sports news. 100K+ downloads on Google Play.',
      description: 'A live-score and sports-news app covering leagues around the world: live matches, fixtures, favourites and push alerts. The data comes from my own API on Cloudflare Workers, which caches and normalises third-party feeds at the edge so the app stays fast for an international audience and cheap to run.',
      metrics: ['100K+ downloads', 'Edge API on Cloudflare Workers'],
      gallery: range('fawanews', 5),
      tech: ['Flutter', 'Cloudflare Workers', 'Firebase', 'Push notifications', 'Node.js']
    }
  ];

  readonly webProjects: Project[] = [
    {
      title: 'DADA Rent Car',
      category: 'Web · Full-stack · AI automation',
      image: `${IMG}dada.webp`,
      link: 'https://dadarentcar.com',
      linkLabel: 'Visit dadarentcar.com',
      featured: true,
      summary: 'Car rental platform in Tunisia: booking site, admin back-office and AI document processing.',
      description: 'A production car rental platform: a public booking site, an admin back-office and a REST API with scheduled jobs, plus an automation layer that removes most of the manual paperwork.',
      metrics: ['Live in production', 'OCR + AI document intake', 'Online deposits'],
      gallery: [`${IMG}dada.webp`],
      tech: ['React + Vite + TypeScript', 'Node.js / Express', 'MongoDB', 'PaddleOCR', 'Gemini API', 'Cloudflare Workers', 'WhatsApp Business API', 'ClicToPay'],
      caseStudy: {
        problem: 'Bookings came in by phone and WhatsApp, and every rental meant retyping ID cards and driving licences into contracts by hand. That was slow and error-prone at the airport counter.',
        built: [
          'Booking site (React + Vite + TypeScript): catalogue by category, live prices, Tunis-Carthage airport delivery and an online deposit to confirm a booking.',
          'Admin back-office and Node.js / Express / MongoDB API with scheduled jobs.',
          'Document intake: ID cards and licences are scanned with OCR (PaddleOCR), and contracts and documents are extracted with Gemini on Cloudflare Workers.',
          'Customer messaging through the WhatsApp Business API, ClicToPay card payments and transactional e-mail.'
        ],
        challenges: [
          'Reliable extraction from ID and licence photos taken on phones: raw OCR text is turned into structured fields by an LLM running on Cloudflare Workers.',
          'Bilingual French / Arabic content and dinar pricing across the site, admin and messages.'
        ],
        results: [
          'Live at dadarentcar.com with online booking and deposits.',
          'Customer documents are captured automatically instead of being typed by hand.'
        ]
      }
    },
    {
      title: 'Shnell Admin Dashboard',
      category: 'Web · Angular · Real-time',
      image: 'assets/img/dashboard.png',
      link: 'https://shnell.tn',
      linkLabel: 'Visit shnell.tn',
      summary: 'Operations dashboard for the Shnell platform: orders, drivers, revenue and regions.',
      description: 'The admin panel the Shnell team uses to follow deliveries, verify drivers, manage users and track revenue in real time, with role-based access and analytics. Regions, currencies and languages are managed here, so a new country can open without changing the apps.',
      tech: ['Angular', 'Firebase', 'RxJS', 'Chart.js']
    },
    {
      title: 'Ste Belhaj Amor',
      category: 'Web · Client website',
      image: `${IMG}belhaj-amor.webp`,
      link: 'https://ste-belhaj-amor.web.app',
      linkLabel: 'Visit the website',
      summary: 'Bilingual showcase site for a tiles, ceramics and sanitaryware store in Sahline.',
      description: 'A French / Arabic website for Ste Belhaj Amor, a building-materials store on the Sousse road in Sahline. It presents the product range and the store, highlights the instalment payment offer (a deposit, then a monthly amount), and turns visitors into customers with one-tap WhatsApp and phone contact.',
      tech: ['Angular', 'Firebase Hosting', 'Multilingual FR · AR', 'Responsive design', 'SEO']
    },
    {
      title: 'Coach Aymen Othmeni',
      category: 'Web · Client website',
      image: `${IMG}coach-othmeni.webp`,
      link: 'https://coach-othmeni.pages.dev',
      linkLabel: 'Visit the website',
      summary: 'Conversion-focused website for a weight-loss coach based in Dubai.',
      description: 'A fast, dark-themed website for a Dubai-based weight-loss coach: offers, an application flow for new clients and a link to the client dashboard. Hosted on Cloudflare Pages.',
      tech: ['Angular', 'Cloudflare Pages', 'Responsive design']
    },
    {
      title: 'AI Assistant',
      category: 'AI · Open-source LLM at the edge',
      image: 'assets/img/chatbot.png',
      link: '#ask-ai',
      linkLabel: 'Try it on this page',
      summary: 'The assistant on this page: an open-source LLM served by Cloudflare Workers AI.',
      description: 'An open-source model (Llama 3.1) on Cloudflare Workers AI, called from a serverless Pages Function I wrote: fixed system prompt with my profile, input limits, rate limiting and streamed answers. Always on, with no server to maintain.',
      tech: ['Cloudflare Workers AI', 'Pages Functions', 'Llama 3.1', 'TypeScript', 'Streaming']
    }
  ];

  readonly skillGroups = [
    { title: 'Mobile', icon: 'fa-solid fa-mobile-screen', items: ['Flutter', 'Dart', 'Firebase (Auth, Firestore, FCM)', 'Google Maps', 'Play Store publishing'] },
    { title: 'Web', icon: 'fa-solid fa-code', items: ['Angular', 'RxJS', 'React + Vite', 'TypeScript', 'Responsive UI'] },
    { title: 'Backend', icon: 'fa-solid fa-server', items: ['Node.js / Express', 'MongoDB', 'REST APIs', 'WebSockets', 'Cron jobs'] },
    { title: 'Cloud & DevOps', icon: 'fa-solid fa-cloud', items: ['Cloudflare Workers & Pages', 'Workers AI', 'Git / GitHub', 'API security'] },
    { title: 'AI & Automation', icon: 'fa-solid fa-wand-magic-sparkles', items: ['LLMs (Workers AI, Ollama)', 'Gemini API', 'OCR (PaddleOCR)', 'Prompt engineering', 'WhatsApp Business API'] }
  ];

  readonly techIcon = techIcon;

  selectedProject: Project | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  openProject(project: Project, event?: Event) {
    event?.preventDefault();
    this.selectedProject = project;
    if (isPlatformBrowser(this.platformId)) document.body.style.overflow = 'hidden';
  }

  closeProject() {
    this.selectedProject = null;
    if (isPlatformBrowser(this.platformId)) document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.selectedProject) this.closeProject();
  }

  isInternal(link: string) {
    return link.startsWith('#');
  }

  /** Never return false here: Angular calls preventDefault() when a
   *  (click) handler returns false, which would block the link. */
  onCtaClick(link: string): void {
    if (this.isInternal(link)) this.closeProject();
  }
}
