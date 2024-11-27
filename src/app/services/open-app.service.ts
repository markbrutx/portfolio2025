import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OpenApp } from '../models/desktop.models';
import { AppID } from '../shared/app-id.enum';

@Injectable({
  providedIn: 'root',
})
export class OpenAppService {
  private readonly openAppsSubject = new BehaviorSubject<ReadonlyArray<OpenApp>>([]);
  readonly openApps$: Observable<ReadonlyArray<OpenApp>> = this.openAppsSubject.asObservable();

  getOpenApps(): ReadonlyArray<OpenApp> {
    return this.openAppsSubject.getValue();
  }

  setOpenApps(openApps: ReadonlyArray<OpenApp>): void {
    this.openAppsSubject.next(openApps);
  }

  openApp(appId: AppID): void {
    const currentApps = this.getOpenApps();
    const existingApp = currentApps.find(app => app.id === appId);

    if (existingApp) {
      const updatedApps = currentApps.map(app =>
        app.id === appId ? { ...app, isOpen: true } : app
      );
      this.setOpenApps(updatedApps);
    } else {
      this.setOpenApps([...currentApps, { id: appId, isOpen: true }]);
    }
  }

  closeAllApps(): void {
    this.setOpenApps([]);
  }
}
