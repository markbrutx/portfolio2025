import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-traffic-lights',
  standalone: true,
  templateUrl: './traffic-lights.component.html',
  styleUrls: ['./traffic-lights.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrafficLightsComponent {
  @Output() close = new EventEmitter<void>();
  @Output() maximize = new EventEmitter<void>();
  @Output() minimize = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  onMaximize() {
    this.maximize.emit();
  }

  onMinimize() {
    this.minimize.emit();
  }
}
