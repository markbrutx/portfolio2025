import { Injectable } from '@angular/core';
import { DockItem } from '../../models/dock-item.model'
import { AppID } from '../../shared/app-id.enum'

@Injectable({
  providedIn: 'root',
})
export class DockItemsService {
  getDockItems(): DockItem[] {
    return [
      { iconSrc: 'assets/icons/finder.png', label: 'Home', scale: 1, appId: AppID.Home },
      { iconSrc: 'assets/icons/me.png', label: "That's Me", scale: 1, appId: AppID.AboutMe },
      { iconSrc: 'assets/icons/calendar.png', label: 'Experience', scale: 1, appId: AppID.Experience },
      { iconSrc: 'assets/icons/cmd.png', label: 'Projects', scale: 1, appId: AppID.Projects },
      { iconSrc: 'assets/icons/settings.png', label: 'Skills', scale: 1, appId: AppID.Skills },
      { iconSrc: 'assets/icons/books.png', label: 'Education', scale: 1, appId: AppID.Education },
      { iconSrc: 'assets/icons/yt.png', label: 'My Youtube Channel', scale: 1, appId: AppID.Youtube },
      { iconSrc: 'assets/icons/mail.png', label: 'Contacts', scale: 1, appId: AppID.Contacts },
      { iconSrc: 'assets/icons/pages.png', label: 'Download CV', scale: 1, appId: AppID.CV },
    ];
  }
}
