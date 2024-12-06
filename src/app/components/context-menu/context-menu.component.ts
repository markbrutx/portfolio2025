import { 
  Component, 
  signal, 
  HostListener, 
  OnInit, 
  ChangeDetectionStrategy,
  inject,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileDownloadService } from '../../services/file-download.service';
import { OpenAppService } from '../../services/open-app.service';
import { AnalyticsService } from '../../services/analytics.service';
import { contextMenu } from '../../models/menus/menu-data';
import { MenuItem } from '../../models/menus/menu-item.interface';
import { Position } from '../../models/desktop.models';
import { AnalyticsEvent } from '../../constants/analytics.constants';

interface MenuDimensions {
  readonly width: number;
  readonly height: number;
}

const MENU_DIMENSIONS: MenuDimensions = {
  width: 256,
  height: 200
} as const;

@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContextMenuComponent implements OnInit {
  protected menuItems: MenuItem[] = [];
  
  protected readonly isVisible = signal<boolean>(false);
  protected readonly position = signal<Position>({ x: 0, y: 0 });
  
  private readonly viewport = computed(() => ({
    width: window.innerWidth,
    height: window.innerHeight
  }));

  private readonly fileDownloadService = inject(FileDownloadService);
  private readonly openAppService = inject(OpenAppService);
  private readonly analyticsService = inject(AnalyticsService);

  ngOnInit(): void {
    this.menuItems = contextMenu(
      this.openAppService,
      this.fileDownloadService,
      this.analyticsService
    );
  }

  show(x: number, y: number): void {
    this.analyticsService.trackUserInteraction(AnalyticsEvent.CONTEXT_MENU_OPENED);
    const adjustedPosition = this.calculateAdjustedPosition(x, y);
    this.position.set(adjustedPosition);
    this.isVisible.set(true);
  }

  hide(): void {
    this.isVisible.set(false);
  }

  handleItemClick(event: Event, item: MenuItem): void {
    event.stopPropagation();
    this.onMenuItemClick(item);
    item.action();
    this.hide();
  }

  onMenuItemClick(item: MenuItem): void {
    this.analyticsService.trackUserInteraction(AnalyticsEvent.USER_ENGAGED, { itemLabel: item.label });
  }

  @HostListener('document:click')
  protected onDocumentClick(): void {
    if (this.isVisible()) {
      this.hide();
    }
  }

  private calculateAdjustedPosition(x: number, y: number): Position {
    const { width: viewportWidth, height: viewportHeight } = this.viewport();
    
    return {
      x: Math.min(x, viewportWidth - MENU_DIMENSIONS.width),
      y: Math.min(y, viewportHeight - MENU_DIMENSIONS.height)
    };
  }
}
