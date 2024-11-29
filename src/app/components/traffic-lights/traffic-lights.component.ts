import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core'

@Component({
  selector: 'app-traffic-lights',
  standalone: true,
  templateUrl: './traffic-lights.component.html',
  styleUrls: ['./traffic-lights.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrafficLightsComponent {
  readonly allowMaximize = input<boolean>(true)
  readonly close = output<void>()
  readonly maximize = output<void>()
  readonly minimize = output<void>()

  protected readonly isMaximized = signal<boolean>(false)

  protected onClose(): void {
    this.close.emit()
  }

  protected onMaximize(): void {
    if (this.allowMaximize()) {
      this.isMaximized.update(state => !state)
      this.maximize.emit()
    }
  }

  protected onMinimize(): void {
    this.minimize.emit()
  }
}
