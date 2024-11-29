import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  PLATFORM_ID,
  signal,
  effect,
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
export class ClockComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly currentDate = signal(new Date());

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      effect(() => {
        const timer = setInterval(() => {
          this.currentDate.set(new Date());
        }, 1000);
        
        return () => clearInterval(timer);
      });
    }
  }

  protected readonly currentTime = computed(() => 
    this.formatDisplayTime(this.currentDate())
  );

  protected readonly currentISOTime = computed(() =>
    this.formatISOTime(this.currentDate())
  );

  private formatDisplayTime(date: Date): string {
    return date
      .toLocaleString('en-US', TIME_FORMAT_OPTIONS)
      .replace(',', '');
  }

  private formatISOTime(date: Date): string {
    return date.toISOString();
  }
}
