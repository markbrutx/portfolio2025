import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  NgZone,
} from '@angular/core';
import { OpenApp, Position } from '../../models/desktop.models';
import { AppID } from '../../shared/app-id.enum';
import { PositionService } from '../../services/position.service';
import { WindowComponent } from '../window/window.component';
import { isPlatformBrowser, NgForOf, NgIf } from '@angular/common';
import { OpenAppService } from '../../services/open-app.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [WindowComponent, NgForOf, NgIf],
})
export class DesktopComponent implements AfterViewInit, OnDestroy {
  openApps: OpenApp[] = [];
  private readonly windowWidth = 500;
  private readonly windowHeight = 400;
  private destroy$ = new Subject<void>();

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private positionService: PositionService,
    private openAppService: OpenAppService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.openAppService.openApps$
      .pipe(takeUntil(this.destroy$))
      .subscribe((apps) => {
        this.openApps = apps;
        this.cdr.markForCheck();
      });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        requestAnimationFrame(() => {
          const centerPosition = this.positionService.getCenterPosition(
            this.windowWidth,
            this.windowHeight
          );
          this.ngZone.run(() => {
            this.openApp(AppID.AboutMe, centerPosition);
          });
        });
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openApp(appId: AppID, initialPosition?: Position): void {
    const existingApp = this.openApps.find((app) => app.id === appId);

    if (existingApp) {
      existingApp.isOpen = true;
    } else {
      const position =
        initialPosition ??
        this.positionService.getNextPosition(
          this.openApps,
          this.windowWidth,
          this.windowHeight
        );
      this.openApps.push({ id: appId, isOpen: true, initialPosition: position });
    }

    this.cdr.markForCheck();
  }

  closeApp(appId: AppID): void {
    const appIndex = this.openApps.findIndex((app) => app.id === appId);
    if (appIndex !== -1) {
      this.openApps.splice(appIndex, 1);
      this.openAppService.setOpenApps(this.openApps);
    }
  }

  getSafeInitialPosition(app: OpenApp): Position {
    return (
      app.initialPosition ??
      this.positionService.getCenterPosition(
        this.windowWidth,
        this.windowHeight
      )
    );
  }
}
