import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeAnimations();
      this.initBg();
      this.initMagnificPopup();
      this.hidePreloader();
    }
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
