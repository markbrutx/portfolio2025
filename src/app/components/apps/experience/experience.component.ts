import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { NgStyle } from '@angular/common';
import { computed, signal } from '@angular/core';
import { YEARS } from './constants/experience.constants';
import { ExperienceService } from './services/experience.service';
import ExperienceCardComponent from './components/experience-card/experience-card.component';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [
    ExperienceCardComponent,
    NgStyle
  ],
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ExperienceComponent {
  private readonly experienceService = inject(ExperienceService);
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
    this.experienceService.toggleExperience(id);
  };
}
