import { Component, AfterViewInit, Inject, PLATFORM_ID, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AiChatComponent } from '../ai-chat/ai-chat.component';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { techIcon } from './tech-icons';

declare var $: any;

interface Project {
  title: string;
  category: string;
  image: string;
  link: string;
  summary: string;
  description: string;
  tech: string[];
  featured?: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, AiChatComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('lottieContainer', { static: false }) lottieContainer!: ElementRef;

  private lottieAnimation: any = null;
  private lottieWebsiteChar: any = null;
  private lottieBizWoman: any = null;


  mobileProjects: Project[] = [
    {
      title: 'Shnell — Client App',
      category: 'Mobile · Flutter + Firebase',
      image: 'assets/img/shnell.jpg',
      link: 'https://play.google.com/store/apps/details?id=com.shnell.app&hl=fr',
      summary: 'Multi-region delivery app with in-app calls and a matching engine, live on Google Play.',
      description: 'Shnell is an on-demand logistics and delivery platform I founded and built. A matching engine pairs each request with the best nearby transport provider in real time, and the trip is followed live on the map until the item arrives. Clients and drivers talk through a custom in-app communication system (voice calls, video calls and messaging) without sharing phone numbers. The product is multi-region: currencies and languages are configurable, so it is ready to launch in any country.',
      tech: ['Flutter', 'Firebase', 'Matching engine', 'In-app voice & video calls', 'Messaging', 'Multi-currency · i18n', 'Google Maps API']
    },
    {
      title: 'Shnell — Driver App',
      category: 'Mobile · Real-time',
      image: 'assets/img/shnell-driver.jpg',
      link: 'https://play.google.com/store/apps/details?id=com.shnell.shnell_driver',
      summary: 'Companion app for transport partners, live on Google Play.',
      description: 'The driver side of Shnell: partners receive requests dispatched by the matching engine, accept trips, navigate, call or message the client in-app (voice, video, chat), and track their earnings in their local currency. Location is streamed in the background so clients and the admin dashboard see each trip in real time.',
      tech: ['Flutter', 'Firebase', 'WebSockets', 'Background location', 'In-app calls']
    },
    {
      title: 'FawaNews — LiveScore',
      category: 'Mobile · Full-stack',
      image: 'assets/img/fawanews.png',
      link: 'https://play.google.com/store/apps/details?id=com.live.fawanews',
      summary: 'Football live scores and match events, live on Google Play.',
      description: 'A lightweight football app with live results, fixtures and key match events. The data comes from my own scores API running on Cloudflare Workers, so the app stays fast and cheap to run.',
      tech: ['Flutter', 'Node.js', 'Cloudflare Workers', 'Push notifications']
    }
  ];

  webProjects: Project[] = [
    {
      title: 'DADA Rent Car',
      category: 'Web · Full-stack · AI automation',
      image: 'assets/img/dadarentcar.png',
      link: 'https://dadarentcar.com',
      featured: true,
      summary: 'Car rental platform in Tunisia: booking site, admin panel and AI document processing.',
      description: 'A production car rental platform: a public booking site (vehicle catalogue, airport delivery, online deposit), an admin back-office, and a REST API with scheduled jobs. Customer ID cards and driving licences are scanned with OCR, contracts and documents are extracted with AI workers on Cloudflare, and customers are reached through WhatsApp Business, card payments and transactional email.',
      tech: ['React + Vite + TypeScript', 'Node.js / Express', 'MongoDB', 'PaddleOCR', 'Gemini API', 'Cloudflare Workers', 'WhatsApp Business API', 'ClicToPay']
    },
    {
      title: 'Shnell Admin Dashboard',
      category: 'Web · Angular',
      image: 'assets/img/dashboard.png',
      link: 'https://shnell.tn',
      summary: 'Operations dashboard for the Shnell delivery platform.',
      description: 'The admin panel the Shnell team uses to follow deliveries, drivers, users and revenue in real time, with role-based access and analytics. Regions, currencies and languages are managed from here, so a new country can be opened without changing the apps.',
      tech: ['Angular', 'Firebase', 'RxJS', 'Chart.js']
    },
    {
      title: 'Ste Belhaj Amor',
      category: 'Web · Client website',
      image: 'assets/img/belhaj-amor.png',
      link: 'https://ste-belhaj-amor.web.app',
      summary: 'Showcase website for a tiles, ceramics and sanitaryware store in Sahline.',
      description: 'A bilingual (French / Arabic) website for Ste Belhaj Amor, a building-materials store on the Sousse road in Sahline selling stoneware, wall tiles, ceramics and sanitaryware. It presents the product range and the store, highlights the instalment payment offer (a deposit, then a monthly amount), and turns visitors into customers with one-tap WhatsApp and phone contact. Built with Angular and hosted on Firebase.',
      tech: ['Angular', 'Firebase Hosting', 'Multilingual FR · AR', 'WhatsApp contact', 'Responsive design', 'SEO']
    },
    {
      title: 'Coach Aymen Othmeni',
      category: 'Web · Client website',
      image: 'assets/img/face.png',
      link: 'https://coach-othmeni.pages.dev',
      summary: 'Website for a sports coach, deployed on Cloudflare Pages.',
      description: 'A fast, responsive website for a sports coach: services, programmes and clear calls to action so visitors can get in touch. Hosted on Cloudflare Pages.',
      tech: ['Angular', 'Cloudflare Pages', 'Responsive design']
    },
    {
      title: 'AI Assistant',
      category: 'AI · Self-hosted LLM',
      image: 'assets/img/chatbot.png',
      link: '#ask-ai',
      summary: 'The assistant on this page: an open-source LLM served at the edge.',
      description: 'An open-source language model (Llama 3.1) running on Cloudflare Workers AI, called from a serverless Pages Function I wrote: fixed system prompt with my profile, input limits, rate limiting and streamed answers. Always on, no server to maintain. Try it in the "Ask my AI" section.',
      tech: ['Cloudflare Workers AI', 'Pages Functions', 'Llama 3.1', 'TypeScript', 'Streaming']
    }
  ];

  skillGroups = [
    { title: 'Mobile', icon: 'fa fa-mobile', items: ['Flutter', 'Dart', 'Firebase (Auth, Firestore, FCM)', 'Google Maps', 'Play Store publishing'] },
    { title: 'Web', icon: 'fa fa-code', items: ['Angular', 'RxJS', 'React + Vite', 'TypeScript', 'Responsive UI'] },
    { title: 'Backend', icon: 'fa fa-server', items: ['Node.js / Express', 'MongoDB', 'REST APIs', 'WebSockets', 'Cron jobs'] },
    { title: 'Cloud & DevOps', icon: 'fa fa-cloud', items: ['Cloudflare Workers & Pages', 'Workers AI', 'Git / GitHub', 'API security'] },
    { title: 'AI & Automation', icon: 'fa fa-magic', items: ['LLMs (Workers AI, Ollama)', 'Gemini API', 'OCR (PaddleOCR)', 'Prompt engineering', 'WhatsApp Business API'] }
  ];

  readonly techIcon = techIcon;

  selectedProject: Project | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeAnimations();
      this.initBg();
      this.initMagnificPopup();
      this.hidePreloader();
      this.initLottie();
      this.initLottieWebsiteChar();
      this.initLottieBizWoman();
    }
  }

  ngOnDestroy() {
    if (this.lottieAnimation) this.lottieAnimation.destroy();
    if (this.lottieWebsiteChar) this.lottieWebsiteChar.destroy();
    if (this.lottieBizWoman) this.lottieBizWoman.destroy();
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
    $('.loader').fadeOut();
    $('#preloder').delay(400).fadeOut('slow');
  }

  private initBg() {
    $('.set-bg').each(function(this: any) {
      var bg = $(this).data('setbg');
      if (bg) {
        $(this).css('background-image', 'url(' + bg + ')');
      }
    });
  }

  private initMagnificPopup() {
    $('.portfolio-item .port-pic').filter(function(this: any) {
      const href = $(this).attr('href');
      return !$(this).hasClass('no-popup') && href && /(jpg|jpeg|png|gif|bmp|webp)$/i.test(href);
    }).magnificPopup({
      type: 'image',
      mainClass: 'img-popup-warp',
      removalDelay: 500,
    });
  }

  private initializeAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, {
      threshold: 0.1
    });

    document.querySelectorAll('.reveal').forEach((el) => {
      observer.observe(el);
    });
  }

  private async initLottie() {
    try {
      const lottie = await import('lottie-web');
      const response = await fetch('assets/Global Network.json');
      const animationData = await response.json();

      const container = document.getElementById('lottie-hero');
      if (!container) return;

      this.lottieAnimation = lottie.default.loadAnimation({
        container: container,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: animationData,
      });
    } catch (e) {
      console.warn('Lottie failed to load:', e);
    }
  }
  private async initLottieWebsiteChar() {
    try {
      const lottie = await import('lottie-web');
      const response = await fetch('assets/Website character animation.json');
      const animationData = await response.json();
      const container = document.getElementById('lottie-website-char');
      if (!container) return;
      this.lottieWebsiteChar = lottie.default.loadAnimation({
        container,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData,
      });
    } catch (e) {
      console.warn('Website char Lottie failed:', e);
    }
  }

  private async initLottieBizWoman() {
    try {
      const lottie = await import('lottie-web');
      const response = await fetch('assets/Business woman.json');
      const animationData = await response.json();
      const container = document.getElementById('lottie-biz-woman');
      if (!container) return;
      this.lottieBizWoman = lottie.default.loadAnimation({
        container,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData,
      });
    } catch (e) {
      console.warn('Business woman Lottie failed:', e);
    }
  }
}
