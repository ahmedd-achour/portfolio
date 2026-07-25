import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { isPlatformBrowser, CommonModule } from '@angular/common';

declare var $: any;

export interface Project {
  title: string;
  category: string;
  filterCategory: string;
  image: string;
  link: string;
  summary: string;
  description: string;
  tech: string[];
  featured?: boolean;
  highlightBadge?: string;
  keyFeatures?: string[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {
  categories: string[] = ['All', 'Web & SaaS', 'Mobile Apps', 'Cloud & AI'];
  activeCategory: string = 'All';

  projects: Project[] = [
    {
      title: 'Menu QR Platform',
      category: 'SaaS / Restaurant Tech',
      filterCategory: 'Web & SaaS',
      image: 'assets/img/menuqr.jpg',
      link: 'https://menuqr-cu5.pages.dev/',
      summary: 'Digital QR code menu solution digitizing restaurant & cafe menus at affordable prices.',
      description: 'An affordable, high-performance digital QR code menu platform designed for restaurants, coffee shops, and cafes to digitize physical menus. Enables instant menu updates, customized branding, multi-language/currency displays, QR code generator, and an ultra-fast mobile viewing experience for customers without downloading any app.',
      tech: ['Cloudflare Pages', 'QR Code Engine', 'Digital Menu SaaS', 'Responsive UI', 'Real-Time Sync'],
      featured: true,
      highlightBadge: '⚡ NEW PROJECT',
      keyFeatures: [
        'Instant digital QR menu generation for restaurants & cafes',
        'Affordable pricing model with zero setup friction',
        'Real-time price & menu availability management',
        'Mobile-first responsive customer view',
        'Custom branding & multi-currency display'
      ]
    },
    {
      title: 'Dubai Coaching & Client Management Platform',
      category: 'Fintech & Client Management',
      filterCategory: 'Web & SaaS',
      image: 'assets/img/aymen-coaching.jpg',
      link: 'https://aymen-othmani.pages.dev/',
      summary: 'Dubai fitness coach platform with foreign online payments, client suivi (tracking) & admin panel.',
      description: 'A comprehensive personal coaching and enterprise management system built for a Dubai-based fitness coach (Aymen Othmani). Features international online payment integration to receive payments from foreign countries seamlessly, client progress tracking & follow-up (suivi), automated workout & nutrition plans, and an all-in-one admin management dashboard.',
      tech: ['Cloudflare Pages', 'Stripe / Foreign Payments', 'Admin Dashboard', 'Suivi System', 'Node.js'],
      featured: true,
      highlightBadge: '🔥 DUBAI SAAS',
      keyFeatures: [
        'International online payment collection from foreign countries',
        'Client progress follow-up & tracking system (suivi)',
        'Full admin panel dashboard for coach management',
        'Custom workout & nutrition plan builder',
        'Multi-currency subscription & billing workflow'
      ]
    },
    {
      title: 'Logistics Client App (Shnell)',
      category: 'Mobile + Firebase',
      filterCategory: 'Mobile Apps',
      image: 'assets/img/shnell.jpg',
      link: 'https://play.google.com/store/apps/details?id=com.shnell.app&hl=fr',
      summary: 'Smart logistics and on-demand delivery mobile platform.',
      description: 'Shnell is a smart logistics and on-demand delivery platform connecting users with transport providers in real time. Enables requesting deliveries, tracking progress live on maps, and managing package handovers with transparent pricing.',
      tech: ['Flutter', 'Firebase', 'Google Maps API', 'Real-time Tracking'],
      keyFeatures: [
        'Real-time driver location tracking via WebSockets & Maps',
        'On-demand package delivery booking system',
        'Secure in-app payment & fare calculation engine',
        'Push notifications & trip status updates'
      ]
    },
    {
      title: 'Logistics Driver App (Shnell Driver)',
      category: 'Firebase / WebSockets',
      filterCategory: 'Mobile Apps',
      image: 'assets/img/shnell-driver.jpg',
      link: 'https://play.google.com/store/apps/details?id=com.shnell.shnell_driver',
      summary: 'Dedicated mobile app for logistics transport partners.',
      description: 'Empowers transport partners to receive nearby delivery requests, manage active trips, and optimize daily earnings. Includes background location dispatching, optimized navigation, and earning analytics.',
      tech: ['Flutter', 'Firebase', 'WebSockets', 'Background Location'],
      keyFeatures: [
        'Background location tracking for real-time dispatch',
        'Instant delivery job dispatch & acceptance modal',
        'Turn-by-turn route navigation integration',
        'Driver earnings report & trip history'
      ]
    },
    {
      title: 'LiveScore Football App (FawaNews)',
      category: 'Full-stack System',
      filterCategory: 'Mobile Apps',
      image: 'assets/img/fawanews.png',
      link: 'https://play.google.com/store/apps/details?id=com.live.fawanews',
      summary: 'Lightweight football live-score & sports update app.',
      description: 'Delivers real-time match results, live commentary, fixtures, and standings. Engineered for speed and minimal data usage, keeping users updated with live sports action worldwide.',
      tech: ['Flutter', 'Node.js', 'MongoDB', 'Push Notifications'],
      keyFeatures: [
        'Real-time live scores & match timeline updates',
        'Push notifications for favorite teams & key goals',
        'Comprehensive league tables & head-to-head stats',
        'Optimized low-bandwidth API architecture'
      ]
    },
    {
      title: 'On-Demand Web Dashboard',
      category: 'Web Platform',
      filterCategory: 'Web & SaaS',
      image: 'assets/img/dashboard.png',
      link: 'https://shnell.tn',
      summary: 'Enterprise web dashboard for logistics fleet management.',
      description: 'A full-featured enterprise dashboard for managing logistics dispatching, order allocation algorithms, driver fleet tracking, and financial analytics.',
      tech: ['Angular', 'RxJS', 'Node.js', 'Google Maps API'],
      keyFeatures: [
        'Real-time map visualization of active driver fleet',
        'Automated order dispatch & route optimization',
        'Comprehensive revenue & operational analytics',
        'Role-based staff permissions & audit logging'
      ]
    },
    {
      title: 'Cloudflare AI Chatbot Edge API',
      category: 'Serverless AI & Edge Computing',
      filterCategory: 'Cloud & AI',
      image: 'assets/img/chatbot.png',
      link: 'https://livescore.achourahmed709.workers.dev',
      summary: 'Serverless AI backend built on Cloudflare Workers.',
      description: 'High-performance serverless AI backend running at the edge. Provides low-latency conversational AI streaming responses and automated data processing at scale.',
      tech: ['Cloudflare Workers', 'AI / LLM', 'Edge Computing', 'TypeScript'],
      keyFeatures: [
        'Sub-100ms response times running globally at edge nodes',
        'LLM integration for conversational queries',
        'Serverless execution with zero cold-starts',
        'API security rate-limiting & token validation'
      ]
    },
    {
      title: 'Modern Developer Portfolio Architecture',
      category: 'Angular / Modern Architecture',
      filterCategory: 'Web & SaaS',
      image: 'assets/img/home-4-bg.png',
      link: '#',
      summary: 'Glassmorphic responsive portfolio architecture in Angular.',
      description: 'The codebase of this portfolio application built with Angular 17, dark-mode glassmorphism, animated ambient lighting, responsive CSS grid, and modal dialogs.',
      tech: ['Angular', 'TypeScript', 'CSS3', 'RxJS'],
      keyFeatures: [
        'Angular 17 standalone architecture',
        'Custom glassmorphism design system & micro-animations',
        'Responsive layout tuned for mobile, tablet & desktop',
        'SEO & performance optimization'
      ]
    }
  ];

  selectedProject: Project | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeAnimations();
      this.initBg();
      this.hidePreloader();
    }
  }

  get filteredProjects(): Project[] {
    if (this.activeCategory === 'All') {
      return this.projects;
    }
    return this.projects.filter(p => p.filterCategory === this.activeCategory);
  }

  setCategory(cat: string) {
    this.activeCategory = cat;
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.initializeAnimations();
        document.querySelectorAll('.portfolio-item-col').forEach(el => el.classList.add('active'));
      }, 50);
    }
  }

  openProject(project: Project, event: Event) {
    event.preventDefault();
    this.selectedProject = project;
    document.body.style.overflow = 'hidden';
  }

  closeProject() {
    this.selectedProject = null;
    document.body.style.overflow = 'auto';
  }

  private hidePreloader() {
    if (typeof $ !== 'undefined') {
      $(".loader").fadeOut();
      $("#preloder").delay(300).fadeOut("slow");
    }
  }

  private initBg() {
    if (typeof $ !== 'undefined') {
      $('.set-bg').each(function(this: any) {
        var bg = $(this).data('setbg');
        if (bg) {
          $(this).css('background-image', 'url(' + bg + ')');
        }
      });
    }
  }

  private initializeAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, {
      threshold: 0.05
    });

    document.querySelectorAll('.reveal').forEach((el) => {
      observer.observe(el);
    });
  }
}

