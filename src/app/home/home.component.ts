import { Component, AfterViewInit, Inject, PLATFORM_ID, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AiChatComponent } from '../ai-chat/ai-chat.component';
import { isPlatformBrowser, CommonModule } from '@angular/common';

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
      summary: 'On-demand delivery app, live on Google Play.',
      description: 'Shnell is an on-demand logistics and delivery platform I founded and built. The client app lets users request a delivery, get matched with a nearby transport provider in real time, and follow the trip live on the map until the item arrives.',
      tech: ['Flutter', 'Firebase', 'Google Maps API', 'Real-time tracking']
    },
    {
      title: 'Shnell — Driver App',
      category: 'Mobile · Real-time',
      image: 'assets/img/shnell-driver.jpg',
      link: 'https://play.google.com/store/apps/details?id=com.shnell.shnell_driver',
      summary: 'Companion app for transport partners, live on Google Play.',
      description: 'The driver side of Shnell: partners receive delivery requests, accept trips, navigate, and track their earnings. Location is streamed in the background so clients and the admin dashboard see each trip in real time.',
      tech: ['Flutter', 'Firebase', 'WebSockets', 'Background location']
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
      description: 'The admin panel the Shnell team uses to follow deliveries, drivers, users and revenue in real time, with role-based access and analytics.',
      tech: ['Angular', 'Firebase', 'RxJS', 'Chart.js']
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
      title: 'Local AI Assistant',
      category: 'AI · Self-hosted LLM',
      image: 'assets/img/chatbot.png',
      link: '#ask-ai',
      summary: 'The assistant on this page: an open-source LLM running on my own PC.',
      description: 'An open-source language model served with Ollama on my own laptop GPU, behind a small Node.js proxy (rate limiting, streaming, a fixed system prompt) and exposed securely through a Cloudflare Tunnel. No paid AI API is involved. Try it in the "Ask my AI" section.',
      tech: ['Ollama', 'Qwen 2.5', 'Node.js', 'Cloudflare Tunnel', 'Streaming']
    }
  ];

  skillGroups = [
    { title: 'Mobile', icon: 'fa fa-mobile', items: ['Flutter', 'Dart', 'Firebase (Auth, Firestore, FCM)', 'Google Maps', 'Play Store publishing'] },
    { title: 'Web', icon: 'fa fa-code', items: ['Angular', 'RxJS', 'React + Vite', 'TypeScript', 'Responsive UI'] },
    { title: 'Backend', icon: 'fa fa-server', items: ['Node.js / Express', 'MongoDB', 'REST APIs', 'WebSockets', 'Cron jobs'] },
    { title: 'Cloud & DevOps', icon: 'fa fa-cloud', items: ['Cloudflare Workers & Pages', 'Cloudflare Tunnel', 'Git / GitHub', 'API security'] },
    { title: 'AI & Automation', icon: 'fa fa-magic', items: ['Local LLMs (Ollama)', 'Gemini API', 'OCR (PaddleOCR)', 'Prompt engineering', 'WhatsApp Business API'] }
  ];

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
