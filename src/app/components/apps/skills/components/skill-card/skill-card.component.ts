import {
  Component,
  Input,
  ChangeDetectionStrategy,
  inject,
  signal,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperienceClassPipe } from '../../pipes/experience-class.pipe';
import { SkillViewModel } from '../../models/skills.model';
import { AnalyticsService } from '../../../../../services/analytics.service';
import { AnalyticsEvent } from '../../../../../constants/analytics.constants';

@Component({
  selector: 'app-skill-card',
  standalone: true,
  imports: [CommonModule, ExperienceClassPipe],
  templateUrl: './skill-card.component.html',
  styleUrls: ['./skill-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'skill-card',
    '[class.expanded]': 'isExpanded()'
  }
})
export class SkillCardComponent {
  @Input({ required: true }) skill!: SkillViewModel;

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly analyticsService = inject(AnalyticsService);
  protected readonly isExpanded = signal(false);

  toggleExpand(): void {
    const newState = !this.isExpanded();
    this.isExpanded.update(() => newState);
    this.analyticsService.trackUserInteraction(
      newState ? AnalyticsEvent.SKILL_DETAILS_EXPANDED : AnalyticsEvent.SKILL_DETAILS_COLLAPSED,
      { skillName: this.skill.name }
    );
    this.cdr.markForCheck();
  }
}
