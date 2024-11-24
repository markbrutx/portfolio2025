import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  ViewChildren,
  QueryList,
  Output,
  EventEmitter, OnInit,
} from '@angular/core'
import { fromEvent, Subscription } from 'rxjs';
import { isPlatformBrowser, NgForOf, NgIf } from '@angular/common';
import { DockItemComponent } from '../dock-item/dock-item.component';
import { FileDownloadService } from '../../services/file-download.service';
import { AppID } from '../../shared/app-id.enum';
import { DockItemsService } from '../../services/dock/dock-items.service'
import { DockItem } from '../../models/dock-item.model'
import { calculateScaleFactor, isMouseInsideRect } from '../../utils/dock-panel.utils'
import {AppStateService} from '../../state/app-state.service';

@Component({
  selector: 'app-dock-panel',
  templateUrl: './dock-panel.component.html',
  standalone: true,
  imports: [DockItemComponent, NgForOf, NgIf],
  styleUrls: ['./dock-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DockPanelComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('dockPanel', { static: true }) dockPanel!: ElementRef;
  @ViewChildren('dockItem', { read: ElementRef }) dockItemElements!: QueryList<ElementRef>;
  @Output() appOpened = new EventEmitter<AppID>();

  dockItems: DockItem[] = [];
  isDragging = false;
  isMaximizedWindow = false;

  private subscriptions: Subscription[] = [];

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: object,
    private readonly cdr: ChangeDetectorRef,
    private readonly fileDownloadService: FileDownloadService,
    private readonly dockItemsService: DockItemsService,
    private readonly appStateService: AppStateService
  ) {}

  ngOnInit(): void {
    this.dockItems = this.dockItemsService.getDockItems();

    this.subscriptions.push(
      this.appStateService.state$.subscribe((state) => {
        this.isDragging = state.isDragging;
        this.isMaximizedWindow = !!state.maximizedWindowId;
        if (this.isDragging) {
          this.resetDockItemScales();
        }
        this.cdr.markForCheck();
      })
    );
  }

  shouldShowDivider(index: number): boolean {
    return index === 0 || index === this.dockItems.length - 2;
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setupListeners();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  openApp(appId: AppID): void {
    if (appId === AppID.CV) {
      this.handleCVDownload().then();
    } else {
      this.appOpened.emit(appId);
    }
  }

  private async handleCVDownload(): Promise<void> {
    try {
      await this.downloadCV();
    } catch (error) {
      console.error('Error during CV download:', error);
    }
  }

  private setupListeners(): void {
    const dockPanelElement = this.dockPanel.nativeElement;

    this.subscriptions.push(
      fromEvent(dockPanelElement, 'mouseleave').subscribe(() => {
        this.resetDockItemScales();
      }),
      fromEvent<MouseEvent>(window, 'mousemove').subscribe((event) => {
        if (!this.isDragging) {
          this.calculateScales(event.clientX, event.clientY);
        }
      })
    );
  }

  private calculateScales(mouseX: number, mouseY: number): void {
    const dockRect = this.dockPanel.nativeElement.getBoundingClientRect();

    if (!isMouseInsideRect(mouseX, mouseY, dockRect)) {
      this.resetDockItemScales();
      return;
    }

    this.dockItemElements.forEach((itemElementRef, index) => {
      const itemElement = itemElementRef.nativeElement as HTMLElement;
      const rect = itemElement.getBoundingClientRect();
      const imgCenterX = rect.left + rect.width / 2;

      const scaleFactor = calculateScaleFactor(mouseX, imgCenterX);
      this.dockItems[index].scale = parseFloat(scaleFactor.toFixed(2));
    });

    this.cdr.markForCheck();
  }

  private resetDockItemScales(): void {
    this.dockItems.forEach((item) => (item.scale = 1));
    this.cdr.markForCheck();
  }

  async downloadCV(): Promise<void> {
    try {
      await this.fileDownloadService.downloadFile('/assets/cv.pdf', 'Magzhan_CV.pdf');
    } catch (error) {
      console.error('Failed to download CV:', error);
    }
  }
}
