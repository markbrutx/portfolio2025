import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { computed, signal } from '@angular/core';
import { YEARS } from './constants/experience.constants';
import { ExperienceService } from './services/experience.service';
import ExperienceCardComponent from './components/experience-card/experience-card.component';
import { AnalyticsService } from '../../../services/analytics.service';
import { AnalyticsEvent } from '../../../constants/analytics.constants';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [
    CommonModule,
    ExperienceCardComponent
  ],
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ExperienceComponent {
  private readonly experienceService = inject(ExperienceService);
  private readonly analyticsService = inject(AnalyticsService);
  private readonly scrollPosition = signal(0);

  protected readonly experiences = this.experienceService.experiences;
  protected readonly years = YEARS;

  protected readonly containerStyle = computed(() => ({
    '--scroll-position': `${this.scrollPosition()}px`
  }));

  @HostListener('window:scroll')
  protected onScroll(): void {
    this.scrollPosition.set(window.scrollY);
  }

  protected readonly toggleExperience = (id: string): void => {
    const state = this.experienceService.experiences();
    const isActive = state.experiences.some(exp => exp.id === id && exp.isActive);
    
    this.experienceService.toggleExperience(id);
    
    this.analyticsService.trackUserInteraction(
      !isActive ? AnalyticsEvent.EXPERIENCE_DETAILS_EXPANDED : AnalyticsEvent.EXPERIENCE_DETAILS_COLLAPSED,
      { experienceId: id }
    );
  };
}
