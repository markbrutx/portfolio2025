import { effect, inject, signal } from '@angular/core';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  PLATFORM_ID,
  viewChild,
  output,
  OnDestroy,
} from '@angular/core';
import { isPlatformBrowser, NgFor, NgIf } from '@angular/common';
import { DockItemComponent } from '../dock-item/dock-item.component';
import { FileDownloadService } from '../../services/file-download.service';
import { AppID } from '../../shared/app-id.enum';
import { DockItemsService } from '../../services/dock/dock-items.service';
import { DockItem } from '../../models/dock-item.model';
import { AppStateService } from '../../state/app-state.service';
import { OpenAppService } from '../../services/open-app.service';
import { DockAnimationService } from '../../services/dock-animation.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dock-panel',
  templateUrl: './dock-panel.component.html',
  styleUrls: ['./dock-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [DockItemComponent]
})
export class DockPanelComponent implements AfterViewInit, OnDestroy {
  protected readonly dockPanel = viewChild.required<ElementRef>('dockPanel');
  protected readonly appOpened = output<AppID>();

  private readonly destroy$ = new Subject<void>();
  private readonly platformId = inject(PLATFORM_ID);
  private readonly fileDownloadService = inject(FileDownloadService);
  private readonly dockItemsService = inject(DockItemsService);
  private readonly appStateService = inject(AppStateService);
  private readonly openAppService = inject(OpenAppService);
  private readonly dockAnimationService = inject(DockAnimationService);

  protected readonly dockItems = signal<ReadonlyArray<DockItem>>([]);
  protected readonly animations = signal<ReadonlyArray<{ appId: string; scale: number; bounce: number }>>([]);
  protected readonly isDragging = signal(false);
  protected readonly isMaximizedWindow = signal(false);

  protected getAnimationForItem(appId: string): { scale: number; bounce: number } | undefined {
    return this.animations().find(a => a.appId === appId);
  }

  constructor() {
    this.dockItemsService.dockItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.dockItems.set(items);
        this.dockAnimationService.setItems(items as DockItem[]);
      });

    this.dockAnimationService.items$
      .pipe(takeUntil(this.destroy$))
      .subscribe(animations => {
        this.animations.set(animations);
      });

    effect(() => {
      this.appStateService.state$
        .pipe(takeUntil(this.destroy$))
        .subscribe((state) => {
          this.isDragging.set(state.isDragging);
          this.isMaximizedWindow.set(!!state.maximizedWindowId);
        });
    });
  }

  protected shouldShowDivider(index: number): boolean {
    return index === 0 || index === this.dockItems().length - 3;
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setupMouseListeners();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected async openApp(appId: AppID): Promise<void> {
    this.dockAnimationService.triggerBounceAnimation(appId);

    if (appId === AppID.CV) {
      await this.handleCVDownload();
    } else if (appId === AppID.Youtube) {
      window.open('https://www.youtube.com/@TheMarkBrut', '_blank');
    } else {
      this.openAppService.openApp(appId);
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

  private setupMouseListeners(): void {
    const dockPanelElement = this.dockPanel().nativeElement;

    const handleMouseMove = (event: MouseEvent) => {
      if (!this.isDragging()) {
        const rect = dockPanelElement.getBoundingClientRect();

        if (
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom
        ) {
          this.dockAnimationService.setMousePosition(event.clientX, event.clientY);
        }
      }
    };

    dockPanelElement.addEventListener('mousemove', handleMouseMove, { passive: true });

    dockPanelElement.addEventListener('mouseleave', () => {
      this.dockAnimationService.setMousePosition(null, null);
    }, { passive: true });
  }
  private async downloadCV(): Promise<void> {
    try {
      await this.fileDownloadService.downloadCV();
    } catch (error) {
      console.error('Error in dock panel CV download:', error);
    }
  }
}
