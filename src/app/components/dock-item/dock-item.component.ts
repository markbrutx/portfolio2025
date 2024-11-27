import { computed, effect, signal } from '@angular/core'
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core'

@Component({
  selector: 'app-dock-item',
  templateUrl: './dock-item.component.html',
  styleUrls: ['./dock-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class DockItemComponent {
  readonly iconSrc = input.required<string>();
  readonly label = input.required<string>();
  readonly index = input.required<number>();
  readonly isActive = input<boolean>(true);
  readonly scale = input.required<number>();
  readonly clicked = output<void>()

  protected readonly sizeRem = computed(() => 4 * this.scale())
  protected readonly tooltipVisible = signal(false)
  protected readonly transitionDuration = signal('0.2s')

  private _previousScale = 1

  constructor() {
    effect(() => {
      const currentScale = this.scale()
      this.transitionDuration.set(currentScale > this._previousScale ? '0.1s' : '0.3s')
      this._previousScale = currentScale
    })
  }

  protected showTooltip(): void {
    this.tooltipVisible.set(true)
  }

  protected hideTooltip(): void {
    this.tooltipVisible.set(false)
  }

  protected onClick(): void {
    this.clicked.emit()
  }
}
