import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  PLATFORM_ID,
  QueryList,
  ViewChildren,
  inject,
  signal,
  computed
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { SKILLS_DATA } from './data/skills.data';
import { SkillCardComponent } from './components/skill-card/skill-card.component';
import { CategoryViewModel } from './models/skills.model';
import { ExperienceLevel, EXPERIENCE_THRESHOLDS } from './constants/experience-levels.enum';

const INTERSECTION_THRESHOLD = 0.1;

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, SkillCardComponent],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'skills-component',
    '[class.is-scrolled]': 'isScrolled()'
  }
})
export class SkillsComponent implements AfterViewInit {
  @ViewChildren('skillCard')
  private readonly skillCards!: QueryList<ElementRef<HTMLElement>>;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly observer = signal<IntersectionObserver | null>(null);
  private readonly skillsData = signal(SKILLS_DATA);

  protected readonly isScrolled = signal(false);
  protected readonly categories = computed<CategoryViewModel[]>(() =>
    Object.entries(this.skillsData()).map(([key, category]) => ({
      key,
      category: {
        ...category,
        skills: category.skills.map(skill => ({
          ...skill,
          experienceLevel: this.getExperienceLevel(skill.years)
        }))
      }
    }))
  );

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.initIntersectionObserver();
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.observeSkillCards();
    }
  }

  private getExperienceLevel(years: number): ExperienceLevel {
    if (years >= EXPERIENCE_THRESHOLDS.Expert) return ExperienceLevel.Expert;
    if (years >= EXPERIENCE_THRESHOLDS.Advanced) return ExperienceLevel.Advanced;
    if (years >= EXPERIENCE_THRESHOLDS.Intermediate) return ExperienceLevel.Intermediate;
    return ExperienceLevel.Beginner;
  }

  private initIntersectionObserver(): void {
    this.observer.set(new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            this.observer()?.unobserve(entry.target);
          }
        });
      },
      { threshold: INTERSECTION_THRESHOLD }
    ));
  }

  private observeSkillCards(): void {
    if (!this.observer()) return;

    this.skillCards.forEach(card => this.observer()?.observe(card.nativeElement));
  }
}
