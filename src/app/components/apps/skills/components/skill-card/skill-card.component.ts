import {
  Component,
  Input,
  ChangeDetectionStrategy,
  inject,
  ChangeDetectorRef,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperienceClassPipe } from '../../pipes/experience-class.pipe';
import { SkillViewModel } from '../../models/skills.model';

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
  protected readonly isExpanded = signal(false);

  toggleExpand(): void {
    this.isExpanded.update(state => !state);
    this.cdr.markForCheck();
  }
}
