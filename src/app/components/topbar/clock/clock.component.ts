import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
  PLATFORM_ID,
  NgZone,
  signal,
  Signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const TIME_FORMAT_OPTIONS = {
  weekday: 'short',
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
} as const;

@Component({
  selector: 'app-clock',
  standalone: true,
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClockComponent implements OnInit, OnDestroy {
  protected readonly currentTime = signal('');
  private timerId: number | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        this.updateTime();
        this.timerId = window.setInterval(() => {
          this.ngZone.run(() => this.updateTime());
        }, 60000);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  private updateTime(): void {
    const now = new Date();
    this.currentTime.set(
      now
        .toLocaleString('en-US', TIME_FORMAT_OPTIONS)
        .replace(',', '')
    );
  }
}
