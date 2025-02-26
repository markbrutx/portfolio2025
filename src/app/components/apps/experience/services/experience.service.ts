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
        id: 'tny',
        company: 'tny.',
        role: 'Senior Frontend Developer',
        location: 'London Area, United Kingdom',
        period: { start: 'Dec 2024', end: 'Present' },
        stack: [
          'React',
          'Next.js',
          'TypeScript',
          'Github CI/CD',
          'Tailwind',
          'Vite',
          'Redux'
        ],
        achievements: [
          'Project SMT: Developed a high-performance dashboard for order management (150,000+ orders/month), optimized performance with advanced filtering, and ensured system stability under high load',
          'Project CSMP: Led architectural and technical decisions for an adaptive interface to manage orders and subscriptions; created dynamic UIs for order modifications and cancellations, and delivered scalable solutions for onboarding new brands'
        ],
        iconPath: 'assets/icons/tny.png'
      },
      {
        id: 'copaco',
        company: 'Sigli/Copaco.com',
        role: 'Senior Software Engineer',
        location: 'Vilniaus, Lithuania',
        period: { start: 'Feb 2024', end: 'Feb 2025' },
        stack: [
          'React',
          'Angular',
          'Bootstrap',
          'jQuery',
          'JS',
          'InterShop',
          'Java'
        ],
        achievements: [
          'Redesigned over 20 client-facing pages and refactored 100,000+ lines of legacy code to boost performance and maintainability',
          'Implemented new features and contributed to architectural decisions for enhanced scalability and system stability within an international team'
        ],
        iconPath: 'assets/icons/sigli.png'
      },
      {
        id: 'htkz',
        company: 'ht.kz',
        role: 'Software Engineer',
        location: 'Almaty, Kazakhstan',
        period: { start: 'May 2020', end: 'Mar 2024' },
        stack: [
          'TypeScript',
          'Angular',
          'WebSockets',
          'RxJs',
          'NestJS',
          'Webpack',
          'Node.js',
          'PHP',
          'Angular Material'
        ],
        achievements: [
          'CRM: Integrated WhatsApp, implemented Amplitude tracking, optimized performance through code refactoring, and enhanced telephony management with improved notifications and direct call capabilities',
          'Travel Search Engine: Fixed critical bugs and fully integrated the search engine with the CRM for seamless data synchronization',
          'Built a CRM system from scratch, actively used in the business, driving revenue growth and improving the company\'s overall conversion rate',
          'Developed numerous CRM features, including chat systems, interaction histories, notifications, and voice messaging capabilities',
          'Designed and implemented ZenMode, a TikTok-like interface to reduce response times and cognitive load for sales managers'
        ],
        iconPath: 'assets/icons/ht.png'
      },
      {
        id: 'parakozm',
        company: 'parakozm.',
        role: 'Software Engineer',
        location: 'Nur-Sultan, Kazakhstan',
        period: { start: 'Nov 2019', end: 'Apr 2020' },
        stack: [
          'MongoDB',
          'Express.JS',
          'React',
          'Node.js'
        ],
        achievements: [
          'Developed a Learning Management System (LMS) using the MERN stack, designed intuitive interfaces, and provided input on key architectural decisions'
        ],
        iconPath: 'assets/icons/parakozm.png'
      },
      {
        id: 'nda',
        company: 'NDA Companies',
        role: 'Python Developer',
        location: 'Kazakhstan',
        period: { start: 'Feb 2018', end: 'Nov 2019' },
        stack: [
          'Python',
          'Selenium',
          'BeautifulSoup4',
          'Django Rest Framework',
          'Telegram API'
        ],
        achievements: [
          'Designed advanced web scrapers using Selenium and BeautifulSoup4, built robust APIs with Django Rest Framework, and developed Telegram bots to automate content posting',
          'Created APIs handling 10,000 daily requests with 99.5% data accuracy'
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