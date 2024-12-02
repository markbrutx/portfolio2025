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

  onMenuItemSelect(item: MenuItem): void {
    this.analyticsService.trackMenuItemSelect(item.label);
  }

  viewSource(): void {
    this.analyticsService.trackSourceCodeView();
  }
}
