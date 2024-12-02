import { Injectable, inject } from '@angular/core';
import { AnalyticsCategory, AnalyticsAction, AnalyticsLabel, AnalyticsEvent } from '../constants/analytics.constants';

declare global {
  interface Window {
    gtag: (
      command: 'event' | 'config' | 'js' | 'set',
      action: string,
      params?: any
    ) => void;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private sendEvent(event: AnalyticsEvent): void {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value
      });
    }
  }

  trackMenuItemSelect(label: string): void {
    this.sendEvent({
      category: AnalyticsCategory.MENU,
      action: AnalyticsAction.MENU_ITEM_SELECT,
      label
    });
  }

  trackMenuOpen(label: string): void {
    this.sendEvent({
      category: AnalyticsCategory.MENU,
      action: AnalyticsAction.MENU_OPEN,
      label
    });
  }

  trackDockAction(action: AnalyticsAction, label: AnalyticsLabel): void {
    this.sendEvent({
      category: AnalyticsCategory.DOCK,
      action,
      label
    });
  }

  trackSourceCodeView(label: string = AnalyticsLabel.GITHUB_REPOSITORY): void {
    this.sendEvent({
      category: AnalyticsCategory.SOURCE_CODE,
      action: AnalyticsAction.VIEW_SOURCE,
      label
    });
  }

  trackDownload(label: string): void {
    this.sendEvent({
      category: AnalyticsCategory.DOCUMENT,
      action: AnalyticsAction.DOWNLOAD,
      label
    });
  }
}
