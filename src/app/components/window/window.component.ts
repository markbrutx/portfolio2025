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
import {isPlatformBrowser, NgClass, NgStyle} from '@angular/common';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Position } from '../../models/desktop.models';
import { WindowStyleService} from '../../services/window/window-style.service';
import { WindowBoundsService } from '../../services/window/window-bounds.service'
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
  @Input() appId!: string
  @Input() width = 500
  @Input() height = 400
  @Input() initialPosition: Position = { x: 100, y: 100 }
  @Input() allowMaximize = true
  @Input() defaultTitle = 'Untitled Window'
  @Output() close = new EventEmitter<void>()

  @ViewChild('window', { static: true }) windowElement!: ElementRef

  position: Position = { ...this.initialPosition }
  isMaximized = false
  isActive = false

  private destroy$ = new Subject<void>()

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private ngZone: NgZone,
    private windowStyleService: WindowStyleService,
    private windowBoundsService: WindowBoundsService
  ) {}

  @HostListener('document:mousedown', ['$event'])
  deactivateWindow(event: MouseEvent) {
    if (
      isPlatformBrowser(this.platformId) &&
      !this.windowContains(event.target)
    ) {
      this.isActive = false
    }
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return

    this.ngZone.runOutsideAngular(() => {
      this.position = { ...this.initialPosition }
      this.updateWindowPosition()
      this.enforceBounds()

      fromEvent(window, 'resize')
        .pipe(debounceTime(200), takeUntil(this.destroy$))
        .subscribe(() => this.ngZone.run(() => this.enforceBounds()))
    })
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }

  startDrag(event: MouseEvent) {
    if (!isPlatformBrowser(this.platformId) || this.isMaximized) return;

    this.windowStyleService.startDrag(
      event,
      this.position,
      this.windowElement.nativeElement,
      (newPosition) => {
        this.position = newPosition;
        this.enforceBounds();
      }
    );
  }

  toggleMaximize() {
    if (!this.allowMaximize) return;
    this.isMaximized = this.windowStyleService.toggleMaximize(
      this.windowElement.nativeElement,
      this.isMaximized,
      this.width,
      this.height,
      this.appId,
      this.position
    );
  }

  activateWindow() {
    this.isActive = true
  }

  updateWindowPosition() {
    if (!isPlatformBrowser(this.platformId) || this.isMaximized) return
    this.windowStyleService.updatePosition(
      this.windowElement.nativeElement,
      this.position
    )
  }

  minimizeWindow() {
    this.close.emit()
  }

  closeWindow() {
    this.close.emit()
  }

  private enforceBounds() {
    if (!isPlatformBrowser(this.platformId)) return

    this.position = this.windowBoundsService.enforceBounds(
      this.windowElement.nativeElement,
      this.position
    )
    this.updateWindowPosition()
  }

  private windowContains(target: EventTarget | null): boolean {
    return this.windowElement.nativeElement.contains(target)
  }
}
