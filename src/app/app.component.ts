import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { NgIf, CommonModule } from '@angular/common';
import { DockPanelComponent } from './components/dock-panel/dock-panel.component';
import { DesktopComponent } from './components/desktop/desktop.component';
import { TopBarComponent } from './components/topbar/top-bar/top-bar.component';
import { BootScreenComponent } from './components/boot-screen/boot-screen.component';

@Component({
  selector: 'app-root',
  imports: [
    DockPanelComponent,
    DesktopComponent,
    TopBarComponent,
    BootScreenComponent,
    NgIf,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'M.N Portfolio 2025';
  userReady = false;

  @ViewChild('desktop') desktop!: DesktopComponent;
}
