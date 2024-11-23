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
  QueryList, Output, EventEmitter,
} from '@angular/core';
import { DockItemComponent } from '../dock-item/dock-item.component';
import { isPlatformBrowser, NgForOf, NgIf } from '@angular/common';
import { fromEvent, Subscription } from 'rxjs';
import {FileDownloadService} from '../../services/file-download.service';
import {AppID} from '../../shared/app-id.enum';


export interface DockItem {
  iconSrc: string;
  label: string;
  scale: number;
  appId: AppID;
}


@Component({
  selector: 'app-dock-panel',
  templateUrl: './dock-panel.component.html',
  standalone: true,
  imports: [DockItemComponent, NgForOf, NgIf],
  styleUrls: ['./dock-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DockPanelComponent implements AfterViewInit, OnDestroy {
  @ViewChild('dockPanel', { static: true }) dockPanel!: ElementRef;
  @ViewChildren('dockItem', { read: ElementRef }) dockItemElements!: QueryList<ElementRef>;
  @Output() appOpened = new EventEmitter<AppID>();


  dockItems: DockItem[] = [
    { iconSrc: 'assets/icons/finder.png', label: 'Home', scale: 1, appId: AppID.Home },
    { iconSrc: 'assets/icons/me.png', label: 'About Me', scale: 1, appId: AppID.AboutMe },
    { iconSrc: 'assets/icons/pages.png', label: 'Download CV', scale: 1, appId: AppID.CV },
    { iconSrc: 'assets/icons/calendar.png', label: 'Experience', scale: 1, appId: AppID.Experience },
    { iconSrc: 'assets/icons/cmd.png', label: 'Projects', scale: 1, appId: AppID.Projects },
    { iconSrc: 'assets/icons/settings.png', label: 'Skills', scale: 1, appId: AppID.Skills },
    { iconSrc: 'assets/icons/books.png', label: 'Education', scale: 1, appId: AppID.Education },
    { iconSrc: 'assets/icons/yt.png', label: 'My Youtube Channel', scale: 1, appId: AppID.Youtube },
    { iconSrc: 'assets/icons/mail.png', label: 'Contacts', scale: 1, appId: AppID.Contacts },
  ];


  private isMouseOverDock = false;
  private mouseMoveSubscription!: Subscription;
  private dockPanelMouseEnterSub!: Subscription;
  private dockPanelMouseLeaveSub!: Subscription;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef,
    private fileDownloadService: FileDownloadService
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.setupDockPanelListeners();
      this.setupGlobalMouseMoveListener();
    }
  }

  ngOnDestroy() {
    this.dockPanelMouseEnterSub?.unsubscribe();
    this.dockPanelMouseLeaveSub?.unsubscribe();
    this.mouseMoveSubscription?.unsubscribe();
  }


  openApp(appId: AppID): void {
    if (appId == AppID.CV) {
      this.downloadCV();
    } else {
      this.appOpened.emit(appId);
      console.log("open app", appId)
    }
  }

  private setupDockPanelListeners() {
    this.dockPanelMouseEnterSub = fromEvent(this.dockPanel.nativeElement, 'mouseenter').subscribe(
      () => {
        this.isMouseOverDock = true;
      }
    );

    this.dockPanelMouseLeaveSub = fromEvent(this.dockPanel.nativeElement, 'mouseleave').subscribe(
      () => {
        this.isMouseOverDock = false;
        this.resetDockItemScales();
      }
    );
  }

  setupGlobalMouseMoveListener() {
    this.mouseMoveSubscription = fromEvent<MouseEvent>(window, 'mousemove').subscribe((event) => {
      this.calculateScales(event.clientX, event.clientY);
    });
  }

  calculateScales(mouseX: number, mouseY: number) {
    const MAX_DISTANCE = 450;
    const MIN_SCALE = 1;
    const MAX_SCALE = 2;

    const dockRect = this.dockPanel.nativeElement.getBoundingClientRect();

    if (mouseX < dockRect.left || mouseX > dockRect.right || mouseY < dockRect.top || mouseY > dockRect.bottom) {
      this.resetDockItemScales();
      return;
    }

    this.dockItemElements.forEach((itemElementRef, index) => {
      const itemElement = itemElementRef.nativeElement as HTMLElement;
      const rect = itemElement.getBoundingClientRect();
      const imgCenterX = rect.left + rect.width / 2;

      const distance = Math.abs(mouseX - imgCenterX);

      const scaleFactor = this.calculateScaleFactor(distance, MAX_DISTANCE, MIN_SCALE, MAX_SCALE);
      this.dockItems[index].scale = parseFloat(scaleFactor.toFixed(2));
    });

    this.cdr.markForCheck();
  }

  calculateScaleFactor(
    distance: number,
    maxDistance: number,
    minScale: number,
    maxScale: number
  ): number {
    if (distance >= maxDistance) {
      return minScale;
    }
    return minScale + (maxScale - minScale) * (1 - distance / maxDistance);
  }

  resetDockItemScales() {
    this.dockItems.forEach((item) => (item.scale = 1));
    this.cdr.markForCheck();
  }

  shouldShowDivider(index: number): boolean {
    return index === 0 || index === this.dockItems.length - 2;
  }

  async downloadCV(): Promise<void> {
    const cvPath = `/assets/cv.pdf`;
    try {
      await this.fileDownloadService.downloadFile(cvPath, 'Magzhan_CV.pdf');
    } catch (error) {
      console.error('Failed to download CV:', error);
    }
  }

}
