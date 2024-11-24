import { Component } from '@angular/core'
import { DockPanelComponent } from './components/dock-panel/dock-panel.component'
import { DesktopComponent } from './components/desktop/desktop.component'
import { TopBarComponent } from './components/topbar/top-bar/top-bar.component'

@Component({
  selector: 'app-root',
  imports: [DockPanelComponent, DesktopComponent, TopBarComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'M.N Portfolio 2025'
}
