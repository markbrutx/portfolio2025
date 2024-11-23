import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  PLATFORM_ID,
} from '@angular/core'
import { OpenApp, Position } from '../../models/desktop.models'
import { AppID } from '../../shared/app-id.enum'
import { PositionService } from '../../services/position.service'
import { WindowComponent } from '../window/window.component'
import { isPlatformBrowser, NgForOf, NgIf } from '@angular/common'

@Component({
  selector: 'app-desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [WindowComponent, NgForOf, NgIf],
})
export class DesktopComponent implements AfterViewInit {
  openApps: OpenApp[] = []
  private readonly windowWidth = 500
  private readonly windowHeight = 400

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private positionService: PositionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      requestAnimationFrame(() => {
        const centerPosition = this.positionService.getCenterPosition(
          this.windowWidth,
          this.windowHeight
        )
        this.openApp(AppID.AboutMe, centerPosition)
      })
    }
  }

  openApp(appId: AppID, initialPosition?: Position): void {
    const existingApp = this.openApps.find((app) => app.id === appId)

    if (existingApp) {
      existingApp.isOpen = true
    } else {
      const position =
        initialPosition ??
        this.positionService.getNextPosition(
          this.openApps,
          this.windowWidth,
          this.windowHeight
        )
      this.openApps.push({ id: appId, isOpen: true, initialPosition: position })
    }

    this.cdr.markForCheck()
  }

  closeApp(appId: AppID): void {
    const appIndex = this.openApps.findIndex((app) => app.id === appId)
    if (appIndex !== -1) {
      this.openApps[appIndex].isOpen = false
      this.cdr.markForCheck()
    }
  }

  getSafeInitialPosition(app: OpenApp): Position {
    return (
      app.initialPosition ??
      this.positionService.getCenterPosition(
        this.windowWidth,
        this.windowHeight
      )
    )
  }
}
