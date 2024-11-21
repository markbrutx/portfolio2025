import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {DockPanelComponent} from './components/dock-panel/dock-panel.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DockPanelComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'M.N Portfolio 2025';
}
