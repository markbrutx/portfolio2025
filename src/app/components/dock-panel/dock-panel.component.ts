import { effect, inject, signal } from '@angular/core'
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  PLATFORM_ID,
  viewChild,
  output,
  OnDestroy,
  ViewChildren,
  QueryList,
} from '@angular/core'
import { fromEvent, Subject, takeUntil, throttleTime, debounceTime } from 'rxjs'
import { isPlatformBrowser } from '@angular/common'
import { DockItemComponent } from '../dock-item/dock-item.component'
import { FileDownloadService } from '../../services/file-download.service'
import { AppID } from '../../shared/app-id.enum'
import { DockItemsService } from '../../services/dock/dock-items.service'
import { DockItem } from '../../models/dock-item.model'
import { calculateScaleFactor, isMouseInsideRect } from '../../utils/dock-panel.utils'
import { AppStateService } from '../../state/app-state.service'
import { OpenAppService } from '../../services/open-app.service'

@Component({
  selector: 'app-dock-panel',
  templateUrl: './dock-panel.component.html',
  styleUrls: ['./dock-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [DockItemComponent],
})
export class DockPanelComponent implements AfterViewInit, OnDestroy {
  protected readonly dockPanel = viewChild.required<ElementRef>('dockPanel');

  @ViewChildren('dockItem', { read: ElementRef })
  private readonly dockItemElements!: QueryList<ElementRef>;

  protected readonly appOpened = output<AppID>();

  private readonly destroy$ = new Subject<void>();
  private readonly platformId = inject(PLATFORM_ID);
  private readonly fileDownloadService = inject(FileDownloadService);
  private readonly dockItemsService = inject(DockItemsService);
  private readonly appStateService = inject(AppStateService);
  private readonly openAppService = inject(OpenAppService);

  protected readonly dockItems = signal<ReadonlyArray<DockItem>>([]);
  protected readonly isDragging = signal(false);
  protected readonly isMaximizedWindow = signal(false);
  private readonly isScalingActive = signal(false);
  private resetTimeout: number | null = null;

  constructor() {
    this.dockItemsService.dockItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.dockItems.set(items);
      });

    effect(() => {
      this.appStateService.state$.pipe(takeUntil(this.destroy$)).subscribe((state) => {
        this.isDragging.set(state.isDragging);
        this.isMaximizedWindow.set(!!state.maximizedWindowId);

        if (state.isDragging) {
          this.resetDockItemScales();
        }
      });
    });
  }

  protected shouldShowDivider(index: number): boolean {
    return index === 0 || index === this.dockItems().length - 2;
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setupListeners()
    }
  }

  ngOnDestroy(): void {
    if (this.resetTimeout) {
      window.clearTimeout(this.resetTimeout);
    }
    this.destroy$.next()
    this.destroy$.complete()
  }

  protected async openApp(appId: AppID): Promise<void> {
    if (appId === AppID.CV) {
      await this.handleCVDownload();
    } else {
      this.openAppService.openApp(appId);
      this.appOpened.emit(appId);
    }
  }

  private async handleCVDownload(): Promise<void> {
    try {
      await this.downloadCV()
    } catch (error) {
      console.error('Error during CV download:', error)
    }
  }

  private setupListeners(): void {
    const dockPanelElement = this.dockPanel().nativeElement;

    fromEvent(dockPanelElement, 'mouseleave')
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(100)
      )
      .subscribe(() => {
        this.handleMouseLeave();
      });

    fromEvent<MouseEvent>(window, 'mousemove')
      .pipe(
        takeUntil(this.destroy$),
        throttleTime(16)
      )
      .subscribe((event) => {
        if (!this.isDragging()) {
          this.handleMouseMove(event.clientX, event.clientY);
        }
      });
  }

  private handleMouseMove(mouseX: number, mouseY: number): void {
    const dockRect = this.dockPanel().nativeElement.getBoundingClientRect();

    if (!isMouseInsideRect(mouseX, mouseY, dockRect)) {
      if (this.isScalingActive()) {
        this.handleMouseLeave();
      }
      return;
    }

    this.isScalingActive.set(true);
    if (this.resetTimeout) {
      window.clearTimeout(this.resetTimeout);
      this.resetTimeout = null;
    }

    this.calculateScales(mouseX, mouseY);
  }

  private handleMouseLeave(): void {
    if (this.isScalingActive()) {
      if (this.resetTimeout) {
        window.clearTimeout(this.resetTimeout);
      }

      this.resetTimeout = window.setTimeout(() => {
        this.resetDockItemScales();
        this.isScalingActive.set(false);
        this.resetTimeout = null;
      }, 100) as unknown as number;
    }
  }

  private calculateScales(mouseX: number, mouseY: number): void {
    const dockRect = this.dockPanel().nativeElement.getBoundingClientRect()

    if (!dockRect || !isMouseInsideRect(mouseX, mouseY, dockRect)) {
      this.handleMouseLeave();
      return;
    }

    const updatedDockItems = [...this.dockItems()].map((item, index) => {
      const itemElement = this.dockItemElements.get(index)?.nativeElement as HTMLElement
      if (!itemElement) return item

      const rect = itemElement.getBoundingClientRect()
      const imgCenterX = rect.left + rect.width / 2
      const scaleFactor = calculateScaleFactor(mouseX, imgCenterX)

      return { ...item, scale: parseFloat(scaleFactor.toFixed(2)) }
    })

    this.dockItems.set(updatedDockItems)
  }

  private resetDockItemScales(): void {
    const resetItems = this.dockItems().map(item => ({ ...item, scale: 1 }));
    this.dockItems.set(resetItems);
  }

  private async downloadCV(): Promise<void> {
    try {
      await this.fileDownloadService.downloadFile('/assets/cv.pdf', 'Magzhan_CV.pdf')
    } catch (error) {
      console.error('Failed to download CV:', error)
    }
  }
}
