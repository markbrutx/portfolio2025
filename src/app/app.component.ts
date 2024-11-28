import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DockPanelComponent } from './components/dock-panel/dock-panel.component';
import { DesktopComponent } from './components/desktop/desktop.component';
import { TopBarComponent } from './components/topbar/top-bar/top-bar.component';
import { BootScreenComponent } from './components/boot-screen/boot-screen.component';
import { DeviceService } from './services/device.service';
import { MobilePlaceholderComponent } from './components/mobile-placeholder/mobile-placeholder.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    DockPanelComponent,
    DesktopComponent,
    TopBarComponent,
    BootScreenComponent,
    MobilePlaceholderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  userReady = false;

  @ViewChild('desktop') desktop!: DesktopComponent;

  constructor(public deviceService: DeviceService) {}
}
