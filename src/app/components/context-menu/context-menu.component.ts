import { 
  Component, 
  signal, 
  HostListener, 
  OnInit, 
  ChangeDetectionStrategy,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileDownloadService } from '../../services/file-download.service';
import { OpenAppService } from '../../services/open-app.service';
import { contextMenu } from '../../models/menus/menu-data';
import { MenuItem } from '../../models/menus/menu-item.interface';
import { Position } from '../../models/desktop.models';

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

  constructor(
    private readonly fileDownloadService: FileDownloadService,
    private readonly openAppService: OpenAppService
  ) {}

  ngOnInit(): void {
    this.menuItems = contextMenu(this.openAppService, this.fileDownloadService);
  }

  show(x: number, y: number): void {
    const adjustedPosition = this.calculateAdjustedPosition(x, y);
    this.position.set(adjustedPosition);
    this.isVisible.set(true);
  }

  hide(): void {
    this.isVisible.set(false);
  }

  handleItemClick(event: Event, item: MenuItem): void {
    event.stopPropagation();
    item.action();
    this.hide();
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
