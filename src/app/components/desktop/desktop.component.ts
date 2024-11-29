import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  PLATFORM_ID,
  NgZone,
  ViewChild,
  HostListener,
  signal,
} from '@angular/core';
import { Position, OpenApp, DesktopAppConfig } from '../../models/desktop.models';
import { AppID } from '../../shared/app-id.enum';
import { PositionService } from '../../services/position.service';
import { WindowComponent } from '../window/window.component';
import { isPlatformBrowser, NgForOf, NgIf } from '@angular/common';
import { OpenAppService } from '../../services/open-app.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DesktopAppRegistryService } from '../../services/desktop/desktop-app-registry.service';
import { CommonModule } from '@angular/common';
import { ContextMenuComponent } from '../context-menu/context-menu.component';

const DEFAULT_WINDOW = {
  width: 500,
  height: 400
} as const;

const INITIAL_WINDOW = {
  width: 600,
  height: 400
} as const;

@Component({
  selector: 'app-desktop',
  standalone: true,
  imports: [WindowComponent, CommonModule, ContextMenuComponent],
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DesktopComponent implements AfterViewInit, OnDestroy {
  protected readonly openApps = signal<ReadonlyArray<OpenApp>>([]);
  
  private readonly destroy$ = new Subject<void>();
  @ViewChild(ContextMenuComponent) private readonly contextMenu!: ContextMenuComponent;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly positionService = inject(PositionService);
  private readonly openAppService = inject(OpenAppService);
  private readonly appRegistry = inject(DesktopAppRegistryService);
  private readonly ngZone = inject(NgZone);

  constructor() {
    this.initializeAppSubscription();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeAnimations();
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

    const position = this.calculateAppPosition(appConfig, initialPosition);
    const updatedApps = this.updateAppsWithNewApp(appId, position, appConfig);
    
    this.updateAppState(updatedApps);
  }

  closeApp(appId: AppID): void {
    const currentApps = [...this.openApps()];
    const appIndex = currentApps.findIndex((app) => app.id === appId);
    
    if (appIndex === -1) return;

    currentApps.splice(appIndex, 1);
    this.updateAppState(currentApps);
  }

  getSafeInitialPosition(app: OpenApp): Position {
    if (!app.initialPosition) {
      const currentApps = this.openApps();
      const openAppsWithPositions = currentApps
        .filter(a => a.isOpen && a.id !== app.id);
      
      
      return this.positionService.getNextPosition(
        openAppsWithPositions,
        app.config?.width ?? DEFAULT_WINDOW.width,
        app.config?.height ?? DEFAULT_WINDOW.height
      );
    }
    return app.initialPosition;
  }

  @HostListener('contextmenu', ['$event'])
  protected onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.contextMenu.show(event.pageX, event.pageY);
  }

  private initializeAppSubscription(): void {
    this.openAppService.openApps$
      .pipe(takeUntil(this.destroy$))
      .subscribe((apps) => {
        const updatedApps = apps.map((app) => ({
          ...app,
          config: this.appRegistry.getAppConfig(app.id) ?? undefined,
        }));
        this.openApps.set(updatedApps);
      });
  }

  private initializeAnimations(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        requestAnimationFrame(() => {
          const centerPosition = this.positionService.getCenterPosition(
            INITIAL_WINDOW.width,
            INITIAL_WINDOW.height
          );
          this.ngZone.run(() => {
            this.openApp(AppID.AboutMe, centerPosition);
          });
        });
      });
    }
  }

  private calculateAppPosition(
    appConfig: DesktopAppConfig,
    initialPosition?: Position
  ): Position {
    const position = initialPosition ?? this.positionService.getNextPosition(
      [...this.openApps()],
      appConfig.width,
      appConfig.height
    );
    return position;
  }

  private updateAppsWithNewApp(
    appId: AppID, 
    position: Position,
    appConfig: DesktopAppConfig
  ): OpenApp[] {
    const currentApps = [...this.openApps()];
    const existingAppIndex = currentApps.findIndex(app => app.id === appId);

    if (existingAppIndex !== -1) {
      currentApps[existingAppIndex] = {
        ...currentApps[existingAppIndex],
        isOpen: true,
        initialPosition: position,
        config: appConfig
      };
      return currentApps;
    }

    const newApps = [...currentApps, {
      id: appId,
      isOpen: true,
      initialPosition: position,
      config: appConfig,
    }];
    return newApps;
  }

  private updateAppState(apps: OpenApp[]): void {
    this.openApps.set(apps);
    this.openAppService.setOpenApps(
      apps.map(({ id, isOpen }) => ({ id, isOpen }))
    );
  }
}
