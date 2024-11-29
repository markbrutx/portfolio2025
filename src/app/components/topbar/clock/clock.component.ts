import {
  ChangeDetectionStrategy,
  Component,
  computed,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

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
  private readonly now = toSignal(
    interval(60000).pipe(
      startWith(0),
      map(() => new Date())
    ),
    { initialValue: new Date() }
  );

  protected readonly currentTime = computed(() => 
    this.formatDisplayTime(this.now())
  );

  protected readonly currentISOTime = computed(() =>
    this.formatISOTime(this.now())
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
