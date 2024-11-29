import {
  Component,
  AfterViewInit,
  ElementRef,
  HostListener,
  ViewChild,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
  NgZone
} from '@angular/core'
import { VideoState } from './about-me.types'

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutMeComponent implements AfterViewInit {
  @ViewChild('video', { static: true })
  private readonly videoElement!: ElementRef<HTMLVideoElement>;
  private readonly ngZone = inject(NgZone);

  private readonly state = signal<VideoState>({
    showWelcomeButton: false,
    emojiAnimating: false,
    userInteracted: false
  });

  protected readonly showWelcomeButton = computed(() => this.state().showWelcomeButton);
  protected readonly emojiAnimating = computed(() => this.state().emojiAnimating);

  ngAfterViewInit(): void {
    this.initializeVideo();
  }

  @HostListener('document:click')
  protected handleUserInteraction(): void {
    if (!this.state().userInteracted) {
      this.updateState({
        userInteracted: true,
        showWelcomeButton: false
      });
      this.playVideo();
    }
  }

  protected handleWelcomeClick(): void {
    this.updateState({ emojiAnimating: true });

    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.ngZone.run(() => {
          this.updateState({ showWelcomeButton: false });
          this.playVideo();
        });
      }, 1500);
    });
  }

  private initializeVideo(): void {
    const playPromise = this.videoElement.nativeElement.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        console.error('Autoplay was blocked by the browser.');
        this.updateState({ showWelcomeButton: true });
      });
    }
  }

  private playVideo(): void {
    this.videoElement.nativeElement.play()
      .catch(() => console.error('Failed to play the video.'));
  }

  private updateState(partialState: Partial<VideoState>): void {
    this.state.update(currentState => ({
      ...currentState,
      ...partialState
    }));
  }
}
