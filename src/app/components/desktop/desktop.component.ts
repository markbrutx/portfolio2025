import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AppID } from '../../shared/app-id.enum';
import { WindowComponent } from '../window/window.component';
import { NgForOf, NgIf } from '@angular/common';

interface OpenApp {
  id: AppID;
  isOpen: boolean;
}

@Component({
  selector: 'app-desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    WindowComponent,
    NgIf,
    NgForOf
  ],
  standalone: true
})
export class DesktopComponent {
  openApps: OpenApp[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  openApp(appId: AppID): void {
    const existingApp = this.openApps.find((app) => app.id === appId);
    if (existingApp) {
      existingApp.isOpen = true;
    } else {
      this.openApps.push({ id: appId, isOpen: true });
    }

    this.cdr.markForCheck();
  }

  closeApp(appId: AppID): void {
    const appIndex = this.openApps.findIndex((app) => app.id === appId);
    if (appIndex !== -1) {
      this.openApps[appIndex].isOpen = false;
      this.cdr.markForCheck();
    }
  }

}
