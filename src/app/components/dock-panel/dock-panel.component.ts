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
} from '@angular/core';
import { DockItemComponent } from '../dock-item/dock-item.component';
import { isPlatformBrowser, NgForOf, NgIf } from '@angular/common';
import { fromEvent, Subscription } from 'rxjs';

interface DockItem {
  iconSrc: string;
  label: string;
  scale: number;
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

  dockItems: DockItem[] = [
    { iconSrc: 'assets/icons/finder.png', label: 'Home', scale: 1 },
    { iconSrc: 'assets/icons/me.png', label: 'About Me', scale: 1 },
    { iconSrc: 'assets/icons/pages.png', label: 'CV', scale: 1 },
    { iconSrc: 'assets/icons/calendar.png', label: 'Experience', scale: 1 },
    { iconSrc: 'assets/icons/cmd.png', label: 'Projects', scale: 1 },
    { iconSrc: 'assets/icons/settings.png', label: 'Skills', scale: 1 },
    { iconSrc: 'assets/icons/books.png', label: 'Education', scale: 1 },
    { iconSrc: 'assets/icons/yt.png', label: 'My Youtube Channel', scale: 1 },
    { iconSrc: 'assets/icons/mail.png', label: 'Contacts', scale: 1 },
  ];

  private isMouseOverDock = false;
  private mouseMoveSubscription!: Subscription;
  private dockPanelMouseEnterSub!: Subscription;
  private dockPanelMouseLeaveSub!: Subscription;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
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

  openApp(label: string) {
    console.log(`Opened application: ${label}`);
    // TODO: Implement application opening logic
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

  private setupGlobalMouseMoveListener() {
    this.mouseMoveSubscription = fromEvent<MouseEvent>(window, 'mousemove').subscribe((event) => {
      this.calculateScales(event.clientX, event.clientY);
    });
  }

  calculateScales(mouseX: number, mouseY: number) {
    const MAX_DISTANCE = 450;
    const MIN_SCALE = 1;
    const MAX_SCALE = 2;

    this.dockItemElements.forEach((itemElementRef, index) => {
      const itemElement = itemElementRef.nativeElement as HTMLElement;
      const rect = itemElement.getBoundingClientRect();
      const imgCenterX = rect.left + rect.width / 2;
      const imgCenterY = rect.top + rect.height / 2;

      const distanceX = mouseX - imgCenterX;
      let distanceY = mouseY - imgCenterY;

      let distance = Math.hypot(distanceX, distanceY);

      if (!this.isMouseOverDock) {
        distanceY += MAX_DISTANCE;
        distance = Math.hypot(distanceX, distanceY);
      }

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
}
