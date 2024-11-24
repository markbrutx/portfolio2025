import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter, Input,
  Output,
} from '@angular/core'
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-traffic-lights',
  standalone: true,
  templateUrl: './traffic-lights.component.html',
  styleUrls: ['./traffic-lights.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrafficLightsComponent {
  @Input() allowMaximize: boolean = true
  @Output() close = new EventEmitter<void>()
  @Output() maximize = new EventEmitter<void>()
  @Output() minimize = new EventEmitter<void>()

  onClose() {
    this.close.emit()
  }

  onMaximize() {
    if (this.allowMaximize) {
      this.maximize.emit()
    }
  }

  onMinimize() {
    this.minimize.emit()
  }
}
