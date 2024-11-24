import { MenuItem } from './menu-item.interface';
import { OpenAppService } from '../../services/open-app.service';

export const appleMenu: MenuItem[] = [
  {
    label: 'Toggle Fullscreen',
    action: () => {
      if (document.fullscreenElement) {
        document.exitFullscreen?.();
      } else {
        document.documentElement.requestFullscreen?.();
      }
    },
  },
  {
    label: 'Clear Cache & Reload',
    action: () => {
      location.reload();
    },
  },
];

export const finderMenu = (openAppService: OpenAppService): MenuItem[] => [
  {
    label: 'View Source',
    action: () => {
      window.open('https://github.com/example-repo', '_blank');
    },
  },
  {
    label: 'Close All Windows',
    action: () => {
      openAppService.closeAllApps();
    },
  },
];

export const helpMenu: MenuItem[] = [
  {
    label: 'Email Author',
    action: () => {
      window.open('mailto:author@example.com', '_blank');
    },
  },
  {
    label: 'Message Author on Telegram',
    action: () => {
      window.open('https://t.me/exampleauthor', '_blank');
    },
  },
];
