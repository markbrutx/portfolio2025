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
import {FileDownloadService} from '../../services/file-download.service';

export enum AppID {
  Home = 'home',
  AboutMe = 'aboutMe',
  CV = 'cv',
  Experience = 'experience',
  Projects = 'projects',
  Skills = 'skills',
  Education = 'education',
  Youtube = 'youtube',
  Contacts = 'contacts',
}

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

  openApp(appId: AppID) {
    switch (appId) {
      case AppID.Home:
        console.log('Opened application: Home');
        // TODO: Add logic to navigate to Home
        break;
      case AppID.AboutMe:
        console.log('Opened application: About Me');
        // TODO: Add logic to navigate to About Me
        break;
      case AppID.CV:
        console.log('Download  CV');
        this.downloadCV();
        break;
      case AppID.Experience:
        console.log('Opened application: Experience');
        // TODO: Add logic to navigate to Experience
        break;
      case AppID.Projects:
        console.log('Opened application: Projects');
        // TODO: Add logic to open Projects
        break;
      case AppID.Skills:
        console.log('Opened application: Skills');
        // TODO: Add logic to navigate to Skills
        break;
      case AppID.Education:
        console.log('Opened application: Education');
        // TODO: Add logic to open Education
        break;
      case AppID.Youtube:
        console.log('Opened application: My Youtube Channel');
        // TODO: Add logic to navigate to Youtube channel
        break;
      case AppID.Contacts:
        console.log('Opened application: Contacts');
        // TODO: Add logic to navigate to Contacts
        break;
      default:
        console.log('Unknown application ID');
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

  async downloadCV(): Promise<void> {
    const cvPath = `/assets/cv.pdf`;
    try {
      await this.fileDownloadService.downloadFile(cvPath, 'Magzhan_CV.pdf');
    } catch (error) {
      console.error('Failed to download CV:', error);
    }
  }

}
