import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ExperienceViewModel } from '../../models/experience.model';
import { computed, signal } from '@angular/core';
import { NgStyle } from '@angular/common'

@Component({
  selector: 'app-experience-card',
  standalone: true,
  templateUrl: './experience-card.component.html',
  styleUrls: ['./experience-card.component.scss'],
  imports: [
    NgStyle,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ExperienceCardComponent {
  @Input({ required: true }) set experience(value: ExperienceViewModel) {
    this.experienceSignal.set(value);
  }
  @Output() cardClick = new EventEmitter<void>();

  protected readonly experienceSignal = signal<ExperienceViewModel | null>(null);

  protected readonly cardStyles = computed(() => {
    const experience = this.experienceSignal();
    if (!experience) return {};

    return {
      '--company-color': experience.companyColor,
      '--company-light': experience.companyLightColor,
    } as const;
  });

  protected readonly achievementDelay = (index: number): string =>
    `${(index + 2) * 0.1}s`;
}
