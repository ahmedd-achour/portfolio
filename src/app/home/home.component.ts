import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
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
export class HomeComponent implements AfterViewInit {
  projects: Project[] = [
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
    $(".loader").fadeOut();
    $("#preloder").delay(400).fadeOut("slow");
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
}
