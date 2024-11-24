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
  PLATFORM_ID,
  Inject,
  NgZone,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { isPlatformBrowser, NgClass, NgStyle } from '@angular/common';
import { WindowPositionService } from '../../services/window-position.service';
import { Position } from '../../models/desktop.models';
import { TrafficLightsComponent } from '../traffic-lights/traffic-lights.component';

@Component({
  selector: 'app-window',
  standalone: true,
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, NgStyle, TrafficLightsComponent],
})
export class WindowComponent implements AfterViewInit, OnDestroy {
  @Input() appId!: string;
  @Input() width = 500;
  @Input() height = 400;
  @Input() initialPosition: Position = { x: 100, y: 100 };
  @Input() allowMaximize = true;
  @Input() defaultTitle = 'Untitled Window';
  @Output() close = new EventEmitter<void>();

  @ViewChild('window', { static: true }) windowElement!: ElementRef;

  position: Position = { ...this.initialPosition };
  isMaximized = false;
  isActive = false;

  private dragSub!: Subscription;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private positionService: WindowPositionService,
    private ngZone: NgZone
  ) {}

  @HostListener('document:mousedown', ['$event'])
  deactivateWindow(event: MouseEvent) {
    if (
      isPlatformBrowser(this.platformId) &&
      !this.windowElement.nativeElement.contains(event.target)
    ) {
      this.isActive = false;
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        this.position = { ...this.initialPosition };
        this.updateWindowPosition();

        this.dragSub = fromEvent(window, 'resize')
          .pipe(debounceTime(200))
          .subscribe(() => this.ngZone.run(() => this.ensureInBounds()));
      });
    }
  }

  ngOnDestroy() {
    this.dragSub?.unsubscribe();
  }

  startDrag(event: MouseEvent) {
    if (!isPlatformBrowser(this.platformId) || this.isMaximized) return;

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

  toggleMaximize() {
    if (this.allowMaximize) {
      this.isMaximized = !this.isMaximized;
    }
  }

  updateWindowPosition() {
    if (!this.isMaximized) {
      const { x, y } = this.position;
      this.windowElement.nativeElement.style.transform = `translate(${x}px, ${y}px)`;
    }
  }

  minimizeWindow() {
    this.close.emit();
  }

  closeWindow() {
    this.close.emit();
  }

  private ensureInBounds() {
    const rect = this.windowElement.nativeElement.getBoundingClientRect();
    this.position = this.positionService.ensureInBounds(
      this.position,
      rect,
      window.innerWidth,
      window.innerHeight
    );
    this.updateWindowPosition();
  }
}
