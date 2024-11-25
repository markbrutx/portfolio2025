import { Component, AfterViewInit, ElementRef, HostListener, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss'],
  standalone: true,
  imports: [NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutMeComponent implements AfterViewInit {
  @ViewChild('video', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;

  showWelcomeButton = false;
  emojiAnimating = false;
  private userInteracted = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.tryAutoPlay();
  }

  private tryAutoPlay(): void {
    const video = this.videoElement.nativeElement;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .catch(() => {
          console.error('Autoplay was blocked by the browser.');
          this.showWelcomeButton = true;
          this.cdr.markForCheck();
        });
    }
  }

  @HostListener('document:click')
  handleUserInteraction(): void {
    if (!this.userInteracted) {
      this.userInteracted = true;
      this.playVideo();
      this.showWelcomeButton = false;
      this.cdr.markForCheck();
    }
  }

  handleWelcomeClick(): void {
    this.emojiAnimating = true;

    setTimeout(() => {
      this.showWelcomeButton = false;
      this.playVideo();
      this.cdr.markForCheck();
    }, 1500);
  }

  private playVideo(): void {
    this.videoElement.nativeElement.play().catch(() => {
      console.error('Failed to play the video.');
    });
  }
}
