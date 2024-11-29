import { AppID } from '../shared/app-id.enum'

export interface DockItem {
  iconSrc: string;
  label: string;
  scale: number;
  bounce: number;
  appId: AppID;
  isActive: boolean;
}
