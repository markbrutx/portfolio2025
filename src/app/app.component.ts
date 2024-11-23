import { Component } from '@angular/core';
import {DockPanelComponent} from './components/dock-panel/dock-panel.component';
import {DesktopComponent} from './components/desktop/desktop.component';

@Component({
  selector: 'app-root',
  imports: [DockPanelComponent, DesktopComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'M.N Portfolio 2025';
}
