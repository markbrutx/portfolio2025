import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { signal } from '@angular/core';
import { YEARS } from '../../constants/experience.constants';

type Year = typeof YEARS[number];

@Component({
  selector: 'app-timeline',
  standalone: true,
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class TimelineComponent {
  @Input({ required: true }) set years(value: readonly Year[]) {
    this.yearsSignal.set(value);
  }

  protected readonly yearsSignal = signal<readonly Year[]>([]);
}
