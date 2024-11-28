import { Component, Input, signal, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileDownloadService } from '../../services/file-download.service';
import { OpenAppService } from '../../services/open-app.service';
import { contextMenu } from '../../models/menus/menu-data';
import { MenuItem } from '../../models/menus/menu-item.interface';

@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements OnInit {
  @Input() menuItems: MenuItem[] = [];
  
  isVisible = signal<boolean>(false);
  position = signal<{ x: number; y: number }>({ x: 0, y: 0 });

  constructor(
    private fileDownloadService: FileDownloadService,
    private openAppService: OpenAppService
  ) {}

  ngOnInit() {
    this.menuItems = contextMenu(this.openAppService, this.fileDownloadService);
  }

  show(x: number, y: number) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const menuWidth = 256; 
    const menuHeight = 200; 

    const adjustedX = Math.min(x, viewportWidth - menuWidth);
    const adjustedY = Math.min(y, viewportHeight - menuHeight);

    this.position.set({ x: adjustedX, y: adjustedY });
    this.isVisible.set(true);
  }

  hide() {
    this.isVisible.set(false);
  }

  handleItemClick(item: MenuItem) {
    item.action();
    this.hide();
  }

  @HostListener('document:click')
  onDocumentClick() {
    if (this.isVisible()) {
      this.hide();
    }
  }
}
