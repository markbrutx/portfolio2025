import { 
  ChangeDetectionStrategy, 
  Component, 
  computed, 
  inject, 
  signal 
} from '@angular/core';
import { appleMenu, finderMenu, helpMenu } from '../../../models/menus/menu-data';
import { MenuItem } from '../../../models/menus/menu-item.interface';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { OpenAppService } from '../../../services/open-app.service';
import { ClockComponent } from '../clock/clock.component';
import { FileDownloadService } from '../../../services/file-download.service';
import { AnalyticsService } from '../../../services/analytics.service';
import { AnalyticsEvent } from '../../../constants/analytics.constants';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [MenuItemComponent, ClockComponent],
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopBarComponent {
  private readonly openAppService = inject(OpenAppService);
  private readonly fileDownloadService = inject(FileDownloadService);
  private readonly analyticsService = inject(AnalyticsService);

  protected readonly appleMenuItems = signal<MenuItem[]>(appleMenu);
  
  protected readonly finderMenuItems = computed(() => 
    finderMenu(this.openAppService)
  );
  
  protected readonly helpMenuItems = computed(() => 
    helpMenu(this.fileDownloadService, this.analyticsService)
  );

  onMenuItemClick(item: MenuItem): void {
    if (item.action) {
      item.action();
    }

    let analyticsEvent: AnalyticsEvent;
    switch (item.label) {
      case 'View Source':
        analyticsEvent = AnalyticsEvent.MENU_SOURCE_CODE_CLICKED;
        break;
      case 'GitHub':
        analyticsEvent = AnalyticsEvent.MENU_GITHUB_CLICKED;
        break;
      case 'YouTube':
        analyticsEvent = AnalyticsEvent.MENU_YOUTUBE_CLICKED;
        break;
      case 'Download CV':
        analyticsEvent = AnalyticsEvent.MENU_CV_CLICKED;
        break;
      case 'Finder':
        analyticsEvent = AnalyticsEvent.MENU_FINDER_CLICKED;
        break;
      default:
        return; 
    }

    this.analyticsService.trackUserInteraction(analyticsEvent);
  }

  onSourceCodeClick(): void {
    this.analyticsService.trackUserInteraction(AnalyticsEvent.SOURCE_CODE_VIEWED);
  }
}
