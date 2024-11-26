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
      title: "That's me :)",
      allowMaximize: false,
      width: 500,
      height: 400,
      component: AboutMeComponent,
    },
    {
      id: AppID.Skills,
      title: 'Skills',
      allowMaximize: true,
      width: 1200,
      height: 800,
      component: SkillsComponent,
    },
  ];

  getAppConfig(appId: AppID): DesktopAppConfig | undefined {
    return this.apps.find((app) => app.id === appId);
  }
}
