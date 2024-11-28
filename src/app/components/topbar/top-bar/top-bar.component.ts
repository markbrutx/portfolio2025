import { Component, Inject, PLATFORM_ID, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { appleMenu, finderMenu, helpMenu } from '../../../models/menus/menu-data';
import { MenuItem } from '../../../models/menus/menu-item.interface';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { OpenAppService } from '../../../services/open-app.service';
import { ClockComponent } from '../clock/clock.component';
import { FileDownloadService } from '../../../services/file-download.service';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [MenuItemComponent, ClockComponent],
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopBarComponent implements OnInit {
  appleMenu: MenuItem[] = appleMenu;
  finderMenu: MenuItem[] = [];
  helpMenu: MenuItem[] = [];

  constructor(
    private openAppService: OpenAppService,
    private fileDownloadService: FileDownloadService,
  ) {}

  ngOnInit() {
    this.finderMenu = finderMenu(this.openAppService);
    this.helpMenu = helpMenu(this.fileDownloadService);
  }
}
