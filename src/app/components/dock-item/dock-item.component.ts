import { computed, signal } from '@angular/core'
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-dock-item',
  templateUrl: './dock-item.component.html',
  styleUrls: ['./dock-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,

  imports: [CommonModule],
})
export class DockItemComponent {
  readonly iconSrc = input.required<string>();
  readonly label = input.required<string>();
  readonly index = input.required<string>();
  readonly isActive = input<boolean>(true);
  readonly scale = input.required<number>();
  readonly clicked = output<void>();

  protected readonly sizeRem = computed(() => 4 * this.scale());
  protected readonly tooltipVisible = signal(false);

  protected readonly iconStyle = computed(() => ({
    transform: `scale(${this.scale()})`,
    transition: this.getTransitionStyle(),
    transformOrigin: 'bottom',
    willChange: 'transform'
  }));

  private previousScale = 1;


  protected readonly tooltipStyle = computed(() => ({
    transform: `translateX(-50%) translateY(-${this.sizeRem()}rem)`,
    transition: this.getTransitionStyle(),
    willChange: 'transform'
  }));



  private getTransitionStyle(): string {
    const currentScale = this.scale();
    const duration = currentScale > this.previousScale ? '80ms' : '200ms';
    this.previousScale = currentScale;
    return `transform ${duration} cubic-bezier(0.2, 0, 0, 1)`;
  }

  protected showTooltip(): void {
    this.tooltipVisible.set(true);
  }

  protected hideTooltip(): void {
    this.tooltipVisible.set(false);
  }

  protected onClick(): void {
    this.clicked.emit();
  }
}
