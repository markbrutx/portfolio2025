import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OpenApp } from '../models/desktop.models';

@Injectable({
  providedIn: 'root',
})
export class OpenAppService {
  private readonly openAppsSubject = new BehaviorSubject<OpenApp[]>([]);
  readonly openApps$: Observable<OpenApp[]> = this.openAppsSubject.asObservable();

  getOpenApps(): ReadonlyArray<OpenApp> {
    return this.openAppsSubject.getValue();
  }

  setOpenApps(openApps: OpenApp[]): void {
    this.openAppsSubject.next([...openApps]);
  }

  addApp(app: OpenApp): void {
    const updatedApps = [...this.getOpenApps(), app];
    this.setOpenApps(updatedApps);
  }

  closeApp(appId: string): void {
    const updatedApps = this.getOpenApps().filter(app => app.id !== appId);
    this.setOpenApps(updatedApps);
  }

  closeAllApps(): void {
    this.setOpenApps([]);
  }
}
