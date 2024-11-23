import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ChangeDetectionStrategy,
} from '@angular/core'
import { NgIf } from '@angular/common'

@Component({
  selector: 'app-dock-item',
  templateUrl: './dock-item.component.html',
  styleUrls: ['./dock-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf],
})
export class DockItemComponent implements OnChanges {
  @Input() iconSrc = ''
  @Input() label = ''
  @Input() index = 0
  @Input() isActive = false
  @Input() scale = 1
  @Output() clicked = new EventEmitter<void>()

  sizeRem = 4
  tooltipVisible = false
  transitionDuration = '0.2s'
  private previousScale = 1

  ngOnChanges(): void {
    this.sizeRem = 4 * this.scale
    const scaleIncreasing = this.scale > this.previousScale
    this.previousScale = this.scale
    this.transitionDuration = scaleIncreasing ? '0.1s' : '0.3s'
  }

  showTooltip(): void {
    this.tooltipVisible = true
  }

  hideTooltip(): void {
    this.tooltipVisible = false
  }

  onClick(): void {
    this.clicked.emit()
  }
}
