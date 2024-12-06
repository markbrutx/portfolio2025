import { Injectable } from '@angular/core';
import { AnalyticsEvent, AnalyticsEventData } from '../constants/analytics.constants';

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
  private isProd = false;

  private sendEvent(eventData: AnalyticsEventData): void {
    if (!this.isProd) {
      console.log(
        '%cAnalytics Event 📊', 
        'background: #1a73e8; color: white; padding: 2px 5px; border-radius: 3px;',
        '\nEvent:', eventData.event,
        eventData.metadata ? '\nMetadata:' + JSON.stringify(eventData.metadata, null, 2) : '',
        eventData.value ? '\nValue: ' + eventData.value : ''
      );
    }

    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', eventData.event, {
        ...eventData.metadata,
        value: eventData.value
      });
    }
  }

  trackUserInteraction(event: AnalyticsEvent | string, metadata?: Record<string, any>, value?: number): void {
    this.sendEvent({ event, metadata, value });
  }
}
