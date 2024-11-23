import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  HostListener,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {NgClass, NgStyle} from '@angular/common';
import {TrafficLightsComponent} from '../traffic-lights/traffic-lights.component';

@Component({
  selector: 'app-window',
  standalone: true,
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    NgStyle,
    TrafficLightsComponent
  ]
})
export class WindowComponent implements AfterViewInit, OnDestroy {
  @Input() appId!: string;
  @Input() width = 400;
  @Input() height = 300;
  @Input() initialPosition = { x: 100, y: 100 };
  @Output() close = new EventEmitter<void>();

  @ViewChild('window', { static: true }) windowElement!: ElementRef;

  position = { ...this.initialPosition };
  isMaximized = false;
  isActive = false;

  private dragSub!: Subscription;

  @HostListener('document:mousedown', ['$event'])
  deactivateWindow(event: MouseEvent) {
    if (!this.windowElement.nativeElement.contains(event.target)) {
      this.isActive = false;
    }
  }

  ngAfterViewInit() {
    this.dragSub = fromEvent(window, 'resize')
      .pipe(debounceTime(200))
      .subscribe(() => this.ensureInBounds());
  }

  ngOnDestroy() {
    this.dragSub?.unsubscribe();
  }

  startDrag(event: MouseEvent) {
    if (this.isMaximized) return;

    const startX = event.clientX;
    const startY = event.clientY;
    const initialX = this.position.x;
    const initialY = this.position.y;

    const moveWindow = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      this.position = {
        x: initialX + deltaX,
        y: initialY + deltaY,
      };
      this.updateWindowPosition();
    };

    const mouseMoveListener = (moveEvent: MouseEvent) => {
      requestAnimationFrame(() => moveWindow(moveEvent));
    };

    const stopDragListener = () => {
      window.removeEventListener('mousemove', mouseMoveListener);
      window.removeEventListener('mouseup', stopDragListener);
    };

    window.addEventListener('mousemove', mouseMoveListener);
    window.addEventListener('mouseup', stopDragListener);
  }

  updateWindowPosition() {
    const { x, y } = this.position;
    this.windowElement.nativeElement.style.transform = `translate(${x}px, ${y}px)`;
  }

  toggleMaximize() {
    this.isMaximized = !this.isMaximized;
  }

  minimizeWindow() {
    // TODO придумать что делать с этой функцией
    this.close.emit();
  }

  closeWindow() {
    this.close.emit();
  }

  private ensureInBounds() {
    const { innerWidth, innerHeight } = window;
    const rect = this.windowElement.nativeElement.getBoundingClientRect();

    this.position.x = Math.max(0, Math.min(rect.x, innerWidth - rect.width));
    this.position.y = Math.max(0, Math.min(rect.y, innerHeight - rect.height));
  }
}
