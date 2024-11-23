import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef, EventEmitter,
  HostListener,
  Input,
  OnDestroy, Output,
  ViewChild,
} from '@angular/core';
import {NgClass, NgStyle} from '@angular/common';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-window',
  standalone: true,
  imports: [NgClass, NgStyle],
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  private resizing = false;

  @HostListener('click')
  activateWindow() {
    this.isActive = true;
  }

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
    if (this.isMaximized || this.resizing) return;

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
    if (this.windowElement) {
      const { x, y } = this.position;
      this.windowElement.nativeElement.style.transform = `translate(${x}px, ${y}px)`;
    }
  }

  toggleMaximize() {
    this.isMaximized = !this.isMaximized;
  }

  minimizeWindow() {
    // TODO Minimizing window
    console.log(`Window ${this.appId} minimized`);
  }

  closeWindow() {
    this.close.emit();
  }


  private ensureInBounds() {
    const { innerWidth, innerHeight } = window;
    const element = this.windowElement.nativeElement;
    const rect = element.getBoundingClientRect();

    if (rect.right > innerWidth) {
      this.position.x = innerWidth - rect.width;
    }
    if (rect.bottom > innerHeight) {
      this.position.y = innerHeight - rect.height;
    }
    if (rect.left < 0) {
      this.position.x = 0;
    }
    if (rect.top < 0) {
      this.position.y = 0;
    }
  }
}
// TODO Проблемы и улучшения в виндоу компоненте
// Открытие работает, но нужно доработать иконки на светофоре
// Придумать как передать туда компоненты, возможно рендерить отдельные компонентики
// Позже список дополнится, иду чинить док панель!
