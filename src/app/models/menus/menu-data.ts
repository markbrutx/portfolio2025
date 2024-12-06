import { MenuItem } from './menu-item.interface';
import { OpenAppService } from '../../services/open-app.service';
import { FileDownloadService } from '../../services/file-download.service';
import { AnalyticsService } from '../../services/analytics.service';
import { AnalyticsEvent } from '../../constants/analytics.constants';

// Common menu actions that can be reused across different menus
export const commonMenuActions = {
  toggleFullscreen: (): MenuItem => ({
    label: 'Toggle Fullscreen',
    action: () => {
      if (document.fullscreenElement) {
        document.exitFullscreen?.();
      } else {
        document.documentElement.requestFullscreen?.();
      }
    },
  }),

  clearCacheAndReload: (): MenuItem => ({
    label: 'Clear Cache & Reload',
    action: () => {
      location.reload();
    },
  }),

  sourceCodeMenuItem: (analyticsService?: AnalyticsService): MenuItem => ({
    label: 'View Source',
    action: () => {
      window.open('https://github.com/markbrutx/portfolio2025', '_blank');
      analyticsService?.trackUserInteraction(AnalyticsEvent.SOURCE_CODE_VIEWED);
    },
  }),

  closeAllWindows: (openAppService: OpenAppService): MenuItem => ({
    label: 'Close All Windows',
    action: () => {
      openAppService.closeAllApps();
    },
  }),

  share: (): MenuItem => ({
    label: 'Share',
    action: () => {
      if (navigator.share) {
        navigator.share({
          title: 'M.N Portfolio 2025',
          text: 'Check out M.N Portfolio 2025!',
          url: window.location.href,
        });
      }
    },
  }),

  downloadCV: (fileDownloadService: FileDownloadService): MenuItem => ({
    label: 'Download CV',
    action: () => {
      fileDownloadService.downloadCV();
    },
  }),

  divider: (): MenuItem => ({
    label: '',
    action: () => {},
    divider: true,
  }),
};

// Menu configurations using the common actions
export const appleMenu: MenuItem[] = [
  commonMenuActions.toggleFullscreen(),
  commonMenuActions.clearCacheAndReload(),
];

export const finderMenu = (openAppService: OpenAppService): MenuItem[] => [
  commonMenuActions.sourceCodeMenuItem(),
  commonMenuActions.closeAllWindows(openAppService),
];

export const helpMenu = (fileDownloadService: FileDownloadService, analyticsService?: AnalyticsService): MenuItem[] => [
  commonMenuActions.share(),
  commonMenuActions.downloadCV(fileDownloadService),
  commonMenuActions.sourceCodeMenuItem(analyticsService),
];

export const contextMenu = (openAppService: OpenAppService, fileDownloadService: FileDownloadService, analyticsService?: AnalyticsService): MenuItem[] => [
  commonMenuActions.sourceCodeMenuItem(analyticsService),
  commonMenuActions.closeAllWindows(openAppService),
  commonMenuActions.toggleFullscreen(),
  commonMenuActions.divider(),
  commonMenuActions.share(),
  commonMenuActions.downloadCV(fileDownloadService),
  commonMenuActions.divider(),
  commonMenuActions.clearCacheAndReload(),
];
