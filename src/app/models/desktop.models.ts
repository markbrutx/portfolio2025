import { AppID } from '../shared/app-id.enum';
import { Type } from '@angular/core';

export interface Position {
  x: number;
  y: number;
}

export interface DesktopAppConfig {
  id: AppID;
  title: string;
  allowMaximize: boolean;
  width: number;
  height: number;
  component: Type<any>;
}

export interface OpenApp {
  id: AppID;
  isOpen: boolean;
  initialPosition?: Position;
  config?: DesktopAppConfig;
}
