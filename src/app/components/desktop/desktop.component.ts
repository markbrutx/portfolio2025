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
import { Position, OpenApp } from '../../models/desktop.models';
import { AppID } from '../../shared/app-id.enum';
import { PositionService } from '../../services/position.service';
import { WindowComponent } from '../window/window.component';
import { isPlatformBrowser, NgForOf, NgIf } from '@angular/common';
import { OpenAppService } from '../../services/open-app.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {DesktopAppRegistryService} from '../../services/desktop/desktop-app-registry.service';

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
  private destroy$ = new Subject<void>();

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private positionService: PositionService,
    private openAppService: OpenAppService,
    private appRegistry: DesktopAppRegistryService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.openAppService.openApps$
      .pipe(takeUntil(this.destroy$))
      .subscribe((apps) => {
        this.openApps = apps.map((app) => ({
          ...app,
          config: this.appRegistry.getAppConfig(app.id) ?? undefined,
        }));
        this.cdr.markForCheck();
      });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        requestAnimationFrame(() => {
          const centerPosition = this.positionService.getCenterPosition(600, 400);
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
    const appConfig = this.appRegistry.getAppConfig(appId);
    if (!appConfig) {
      console.warn(`App config for ${appId} not found`);
      return;
    }

    const position = initialPosition ??
      this.positionService.getNextPosition(this.openApps, appConfig.width, appConfig.height);

    const updatedApps = [...this.openApps];
    const existingAppIndex = updatedApps.findIndex(app => app.id === appId);

    if (existingAppIndex !== -1) {
      updatedApps[existingAppIndex].isOpen = true;
    } else {
      updatedApps.push({
        id: appId,
        isOpen: true,
        initialPosition: position,
        config: appConfig,
      });
    }

    this.openAppService.setOpenApps(updatedApps);
    this.openApps = updatedApps;
    this.cdr.markForCheck();
  }
  closeApp(appId: AppID): void {
    const appIndex = this.openApps.findIndex((app) => app.id === appId);
    if (appIndex !== -1) {
      this.openApps.splice(appIndex, 1);
      this.openAppService.setOpenApps(
        this.openApps.map(({ id, isOpen }) => ({ id, isOpen }))
      );
    }
  }

  getSafeInitialPosition(app: OpenApp): Position {
    return (
      app.initialPosition ??
      this.positionService.getCenterPosition(
        app.config?.width ?? 500,
        app.config?.height ?? 400
      )
    );
  }
}
