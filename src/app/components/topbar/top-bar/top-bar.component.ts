import { Component, Inject, PLATFORM_ID, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { appleMenu, finderMenu, helpMenu } from '../../../models/menus/menu-data';
import { MenuItem } from '../../../models/menus/menu-item.interface';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { OpenAppService } from '../../../services/open-app.service';
import { ClockComponent } from '../clock/clock.component'

@Component({
  selector: 'app-top-bar',
  standalone: true,
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
  imports: [MenuItemComponent, ClockComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopBarComponent implements OnInit {
  readonly appleMenu = appleMenu;
  readonly helpMenu = helpMenu;
  finderMenu: MenuItem[] = [];

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: object,
    private readonly openAppService: OpenAppService
  ) {}

  ngOnInit(): void {
    this.finderMenu = finderMenu(this.openAppService);
  }
}
