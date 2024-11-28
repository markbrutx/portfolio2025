import { Injectable } from '@angular/core';
import { DesktopAppConfig } from '../../models/desktop.models';
import { AppID } from '../../shared/app-id.enum';
import {AboutMeComponent} from '../../components/apps/about-me/about-me.component';
import {SkillsComponent} from '../../components/apps/skills/skills.component';
import ExperienceComponent from '../../components/apps/experience/experience.component';
import { EducationComponent } from '../../components/apps/education/education.component';
import { ContactsComponent } from '../../components/apps/contacts/contacts.component';
import { ProjectsComponent } from '../../components/apps/projects/projects.component';

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
    {
      id: AppID.Experience,
      title: 'Experience',
      allowMaximize: true,
      width: 1200,
      height: 800,
      component: ExperienceComponent,
    },
    {
      id: AppID.Education,
      title: 'Education',
      allowMaximize: true,
      width: 1200,
      height: 800,
      component: EducationComponent,
    },
    {
      id: AppID.Projects,
      title: 'Projects',
      allowMaximize: true,
      width: 1200,
      height: 800,
      component: ProjectsComponent,
    },
    {
      id: AppID.Contacts,
      title: 'Contacts',
      allowMaximize: true,
      width: 1200,
      height: 800,
      component: ContactsComponent,
    },
  ];

  registerApp(appConfig: DesktopAppConfig) {
    this.apps.push(appConfig);
  }

  getAppConfig(appId: AppID): DesktopAppConfig | undefined {
    return this.apps.find((app) => app.id === appId);
  }
}
