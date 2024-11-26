import { Injectable } from '@angular/core';
import { signal } from '@angular/core';
import type { ExperienceViewModel, BaseExperience } from '../models/experience.model';
import { COMPANY_THEMES } from '../constants/experience.constants';

interface ExperienceState {
  readonly experiences: readonly ExperienceViewModel[];
  readonly selectedId: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {
  private readonly state = signal<ExperienceState>({
    experiences: this.createInitialExperiences(),
    selectedId: null
  });

  readonly experiences = this.state.asReadonly();

  private createInitialExperiences(): readonly ExperienceViewModel[] {
    const baseExperiences: readonly BaseExperience[] = [
      {
        id: 'copaco',
        company: 'Sigli/Copaco.com',
        role: 'Senior Software Engineer',
        location: 'Lithuania, Remote',
        period: { start: '2024', end: 'Present' },
        stack: [
          'JS',
          'InterShop',
          'jQuery',
          'Angular',
          'Java',
          'Less',
          'Bootstrap'
        ],
        achievements: [
          'Completed a full redesign of user interfaces for over 20 sections of the e-commerce platform, adhering strictly to style guides and achieving pixel-perfect precision',
          'Implemented new features into the legacy system, enhancing user experience',
          'Collaborated in an international team, overcoming communication barriers'
        ],
        iconPath: 'assets/icons/sigli.png'
      },
      {
        id: 'htkz',
        company: 'ht.kz',
        role: 'Software Engineer',
        location: 'Almaty, Kazakhstan',
        period: { start: '2020', end: '2024' },
        stack: [
          'TypeScript',
          'Angular',
          'Electron',
          'NestJS',
          'NGRX',
          'Webpack',
          'NodeJs'
        ],
        achievements: [
          'Built a CRM system from scratch, actively used in the business, driving revenue growth and improving the company’s overall conversion rate',
          'Personally implemented and integrated the CRM system across multiple sales points, collaborating with sales managers to ensure project success',
          'Developed numerous CRM features, including chat systems, interaction histories, notifications, and voice messaging capabilities',
          'Designed and implemented ZenMode, a TikTok-like interface to reduce response times and cognitive load for sales managers',
          'Worked closely with UI/UX designers, adhering to strict style guides and ensuring seamless user experiences',
          'Mentored junior developers within the team, providing guidance and support for their growth'
        ],
        iconPath: 'assets/icons/ht.png'
      },
      {
        id: 'parakozm',
        company: 'Parakozm',
        role: 'Software Engineer',
        location: 'Astana, Kazakhstan',
        period: { start: '2019', end: '2020' },
        stack: [
          'MongoDB',
          'Express.JS',
          'React',
          'Node.Js'
        ],
        achievements: [
          'Developed LMS using MERN stack, supporting ~5,000 active users',
          'Implemented user-friendly interfaces, increasing session duration by ~20%',
          'Enhanced LMS scalability, accommodating ~50% additional user load'
        ],
        iconPath: 'assets/icons/parakozm.png'
      },
      {
        id: 'nda',
        company: 'NDA Companies',
        role: 'Python Developer',
        location: 'Kazakhstan',
        period: { start: '2018', end: '2019' },
        stack: [
          'Python',
          'Django',
          'DRF',
          'Selenium',
          'BeautifulSoup4',
          'Telegram API'
        ],
        achievements: [
          'Designed web scrapers with 99.5% accuracy in data extraction',
          'Created APIs using Django Rest Framework, handling 10,000 daily requests',
          'Developed Telegram bots, increasing content posting efficiency by 50%'
        ],
        iconPath: 'assets/icons/nda.png'
      }
    ];


    return this.mapToViewModels(baseExperiences);
  }

  private mapToViewModels(experiences: readonly BaseExperience[]): readonly ExperienceViewModel[] {
    return experiences.map(exp => this.mapToViewModel(exp));
  }

  private mapToViewModel(experience: BaseExperience): ExperienceViewModel {
    const themeKey = experience.id.toUpperCase() as keyof typeof COMPANY_THEMES;
    const theme = COMPANY_THEMES[themeKey] || COMPANY_THEMES.COPACO;

    return {
      ...experience,
      companyColor: theme.color,
      companyLightColor: theme.lightColor,
      isActive: false
    };
  }

  toggleExperience(id: string): void {
    this.state.update(state => ({
      ...state,
      experiences: state.experiences.map(exp => ({
        ...exp,
        isActive: exp.id === id ? !exp.isActive : exp.isActive
      }))
    }));
  }
}
