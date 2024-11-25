import { Component, AfterViewInit, ElementRef, HostListener, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss'],
  standalone: true,
  imports: [NgIf],
})
export class AboutMeComponent implements AfterViewInit {
  @ViewChild('video', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;

  showWelcomeButton = true;
  emojiAnimating = false;
  private userInteracted = false;

  ngAfterViewInit(): void {
    this.tryAutoPlay();
  }

  private tryAutoPlay(): void {
    const video = this.videoElement.nativeElement;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        console.error('Autoplay was blocked by the browser.');
      });
    }
  }

  @HostListener('document:click')
  handleUserInteraction(): void {
    if (!this.userInteracted) {
      this.userInteracted = true;
      this.showWelcomeButton = false;
      this.playVideo();
    }
  }

  handleWelcomeClick(): void {
    this.emojiAnimating = true;

    setTimeout(() => {
      this.showWelcomeButton = false;
      this.playVideo();
    }, 1500);
  }

  private playVideo(): void {
    this.videoElement.nativeElement.play().catch(() => {
      console.error('Failed to play the video.');
    });
  }
}
