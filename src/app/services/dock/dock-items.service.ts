import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { DockItem } from '../../models/dock-item.model';
import { AppID } from '../../shared/app-id.enum';
import { OpenAppService } from '../open-app.service';

@Injectable({
  providedIn: 'root',
})
export class DockItemsService {
  private readonly openAppService = inject(OpenAppService);
  private readonly dockItemsSubject = new BehaviorSubject<ReadonlyArray<DockItem>>(this.getInitialDockItems());
  readonly dockItems$: Observable<ReadonlyArray<DockItem>> = this.dockItemsSubject.asObservable();

  constructor() {
    this.openAppService.openApps$.pipe(
      map(openApps => {
        const currentDockItems = this.dockItemsSubject.getValue();
        return currentDockItems.map(item => ({
          ...item,
          isActive: item.appId === AppID.Home || 
                   item.appId === AppID.Youtube || 
                   item.appId === AppID.CV ||
                   openApps.some(app => app.id === item.appId && app.isOpen)
        }));
      })
    ).subscribe(updatedItems => {
      this.dockItemsSubject.next(updatedItems);
    });
  }

  private getInitialDockItems(): DockItem[] {
    return [
      { iconSrc: 'assets/icons/finder.png', label: 'Home', scale: 1, bounce: 0, appId: AppID.Home, isActive: true },
      { iconSrc: 'assets/icons/me.png', label: "That's Me", scale: 1, bounce: 0, appId: AppID.AboutMe, isActive: false },
      { iconSrc: 'assets/icons/calendar.png', label: 'Experience', scale: 1, bounce: 0, appId: AppID.Experience, isActive: false },
      { iconSrc: 'assets/icons/settings.png', label: 'Skills', scale: 1, bounce: 0, appId: AppID.Skills, isActive: false },
      { iconSrc: 'assets/icons/books.png', label: 'Education', scale: 1, bounce: 0, appId: AppID.Education, isActive: false },
      { iconSrc: 'assets/icons/cmd.png', label: 'Projects', scale: 1, bounce: 0, appId: AppID.Projects, isActive: false },
      { iconSrc: 'assets/icons/mail.png', label: 'Contacts', scale: 1, bounce: 0, appId: AppID.Contacts, isActive: false },
      { iconSrc: 'assets/icons/yt.png', label: 'My Youtube Channel', scale: 1, bounce: 0, appId: AppID.Youtube, isActive: true },
      { iconSrc: 'assets/icons/pages.png', label: 'Download CV', scale: 1, bounce: 0, appId: AppID.CV, isActive: true },
    ];
  }
}
