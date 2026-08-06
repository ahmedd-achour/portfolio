import { Component, AfterViewInit, Inject, PLATFORM_ID, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
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
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('lottieContainer', { static: false }) lottieContainer!: ElementRef;

  private lottieAnimation: any = null;
  private lottieWebsiteChar: any = null;
  private lottieBizWoman: any = null;


  projects: Project[] = [
    // ── Mobile Projects ──────────────────────────────────
    {
      title: 'Logistics Client App',
      category: 'Mobile + Firebase',
      image: 'assets/img/shnell.jpg',
      link: 'https://play.google.com/store/apps/details?id=com.shnell.app&hl=fr',
      summary: 'Smart logistics and on-demand delivery platform.',
      description: 'Shnell is a smart logistics and on-demand delivery platform designed to make moving anything faster, simpler, and more reliable. It connects users with nearby transport providers in real time, allowing them to request deliveries, track progress, and receive their items with efficiency and transparency.',
      tech: ['Flutter', 'Firebase', 'Google Maps API', 'Real-time Tracking']
    },
    {
      title: 'Logistics Driver App',
      category: 'Firebase / WebSockets',
      image: 'assets/img/shnell-driver.jpg',
      link: 'https://play.google.com/store/apps/details?id=com.shnell.shnell_driver',
      summary: 'Dedicated mobile application for transport partners.',
      description: 'Shnell Driver enables transport partners to receive delivery requests, manage trips, and optimize their earnings through an intuitive interface. It provides real-time job matching, clear navigation, and simple trip management tools.',
      tech: ['Flutter', 'Firebase', 'WebSockets', 'Background Location']
    },
    {
      title: 'LiveScore Football App',
      category: 'Full-stack system',
      image: 'assets/img/fawanews.png',
      link: 'https://play.google.com/store/apps/details?id=com.live.fawanews',
      summary: 'Lightweight football live-score and sports update app.',
      description: 'FawaNews delivers real-time match results, fixtures, and key events. Designed for speed and simplicity, it keeps users updated with live football action and match statistics in an optimized mobile interface.',
      tech: ['Flutter', 'Node.js', 'MongoDB', 'Push Notifications']
    },
    // ── Web & APIs ────────────────────────────────────────
    {
      title: 'Shnell Dashboard',
      category: 'Web · Admin Panel',
      image: 'assets/img/dashboard.png',
      link: 'https://shnell.tn',
      summary: 'Internal admin dashboard for the Shnell logistics platform.',
      description: 'A full-featured admin panel that gives the Shnell operations team real-time visibility into deliveries, drivers, users, and revenue. Built with Angular and Firebase, it offers live data streams, role-based access, and actionable analytics.',
      tech: ['Angular', 'Firebase', 'RxJS', 'Chart.js']
    },
    {
      title: 'Developer Portfolio',
      category: 'Web · Angular',
      image: 'assets/img/home-4-bg.png',
      link: 'https://ahmedd-achour.github.io/portfolio',
      summary: 'The portfolio you are currently viewing — built with Angular.',
      description: 'A premium single-page portfolio showcasing projects, skills, and work experience. Built with Angular 17, featuring Lottie animations, scroll-reveal effects, a project modal system, and fully responsive mobile-first layout with soft gold accents.',
      tech: ['Angular 17', 'TypeScript', 'Lottie', 'CSS Custom Properties']
    },
   /* {
      title: 'Coach Aymen Othmani',
      category: 'Web · Cloudflare Pages',
      image: 'assets/img/face.png',
      link: 'https://coach-aymen-othmani.pages.dev',
      summary: 'Professional coaching website deployed on Cloudflare Pages.',
      description: 'A sleek and performant coaching website for Aymen Othmani, hosted on Cloudflare Pages for blazing-fast global delivery. Features a modern design, service showcases, and clear calls-to-action for client engagement.',
      tech: ['Angular', 'Cloudflare Pages', 'CSS', 'Responsive Design']
    },*/
    {
      title: 'Cloudflare Chatbot API',
      category: 'Serverless AI & Edge Computing',
      image: 'assets/img/chatbot.png',
      link: 'https://livescore.achourahmed709.workers.dev',
      summary: 'Serverless AI backend built on Cloudflare Workers.',
      description: 'Designed for fast, scalable, and secure conversational responses using an integrated large language model. It runs at the edge, ensuring ultra-low latency and high availability for real-time chatbot applications.',
      tech: ['Cloudflare Workers', 'AI / LLM', 'Edge Computing', 'TypeScript']
    }
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
