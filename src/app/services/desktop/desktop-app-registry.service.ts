import { Injectable } from '@angular/core';
import { DesktopAppConfig } from '../../models/desktop.models';
import { AppID } from '../../shared/app-id.enum';
import {AboutMeComponent} from '../../components/apps/about-me/about-me.component';
import {SkillsComponent} from '../../components/apps/skills/skills.component';

@Injectable({
  providedIn: 'root',
})
export class DesktopAppRegistryService {
  private apps: DesktopAppConfig[] = [
    {
      id: AppID.AboutMe,
      title: 'About Me',
      allowMaximize: false,
      width: 600,
      height: 400,
      component: AboutMeComponent,
    },
    {
      id: AppID.Skills,
      title: 'Skills',
      allowMaximize: true,
      width: 500,
      height: 300,
      component: SkillsComponent,
    },
  ];

  getAppConfig(appId: AppID): DesktopAppConfig | undefined {
    return this.apps.find((app) => app.id === appId);
  }
}
