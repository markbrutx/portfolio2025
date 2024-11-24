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
import { Position } from '../../models/desktop.models';
import { TrafficLightsComponent } from '../traffic-lights/traffic-lights.component';
import { AppStateService } from '../../state/app-state.service';

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
    private appStateService: AppStateService,
    private ngZone: NgZone
  ) {}

  @HostListener('document:mousedown', ['$event'])
  deactivateWindow(event: MouseEvent) {
    if (isPlatformBrowser(this.platformId) && !this.windowContains(event.target)) {
      this.isActive = false;
    }
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.ngZone.runOutsideAngular(() => {
      this.position = { ...this.initialPosition };
      this.updateWindowPosition();
      this.enforceBounds();

      this.dragSub = fromEvent(window, 'resize')
        .pipe(debounceTime(200))
        .subscribe(() => this.ngZone.run(() => this.enforceBounds()));
    });
  }

  ngOnDestroy() {
    this.dragSub?.unsubscribe();
  }

  startDrag(event: MouseEvent) {
    if (!isPlatformBrowser(this.platformId) || this.isMaximized) return;

    const { clientX: startX, clientY: startY } = event;
    const { x: initialX, y: initialY } = this.position;
    this.appStateService.setState({ isDragging: true });

    const moveWindow = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      this.position = { x: initialX + deltaX, y: initialY + deltaY };
      this.enforceBounds();
    };

    this.trackDrag(moveWindow, () => this.appStateService.setState({ isDragging: false }));
  }

  toggleMaximize() {
    if (this.allowMaximize) this.isMaximized = !this.isMaximized;
  }

  updateWindowPosition() {
    if (!isPlatformBrowser(this.platformId) || this.isMaximized) return;
    const { x, y } = this.position;
    this.windowElement.nativeElement.style.transform = `translate(${x}px, ${y}px)`;
  }

  minimizeWindow() {
    this.close.emit();
  }

  closeWindow() {
    this.close.emit();
  }

  private enforceBounds() {
    if (!isPlatformBrowser(this.platformId)) return;

    const rect = this.windowElement.nativeElement.getBoundingClientRect();
    const container = document.querySelector('.windows-area');
    if (!container) return;

    const { minX, maxX, minY, maxY } = this.calculateBounds(container, rect);

    this.position.x = Math.max(minX, Math.min(this.position.x, maxX));
    this.position.y = Math.max(minY, Math.min(this.position.y, maxY));

    this.updateWindowPosition();
  }

  private calculateBounds(container: Element, rect: DOMRect) {
    const containerRect = container.getBoundingClientRect();
    return {
      minX: -200,
      maxX: containerRect.width - rect.width + 200,
      minY: 0,
      maxY: containerRect.height - rect.height + 200,
    };
  }

  private trackDrag(onMove: (moveEvent: MouseEvent) => void, onStop?: () => void) {
    const mouseMoveListener = (event: MouseEvent) => requestAnimationFrame(() => onMove(event));
    const stopDragListener = () => {
      window.removeEventListener('mousemove', mouseMoveListener);
      window.removeEventListener('mouseup', stopDragListener);
      if (onStop) onStop();
    };
    window.addEventListener('mousemove', mouseMoveListener);
    window.addEventListener('mouseup', stopDragListener);
  }

  private windowContains(target: EventTarget | null): boolean {
    return this.windowElement.nativeElement.contains(target);
  }
}
