import { Pipe, PipeTransform } from '@angular/core';
import { ExperienceLevel, EXPERIENCE_THRESHOLDS } from '../constants/experience-levels.enum';

@Pipe({
  name: 'experienceClass',
  standalone: true,
  pure: true
})
export class ExperienceClassPipe implements PipeTransform {
  transform(years: number): ExperienceLevel {
    if (years >= EXPERIENCE_THRESHOLDS.Expert) return ExperienceLevel.Expert;
    if (years >= EXPERIENCE_THRESHOLDS.Advanced) return ExperienceLevel.Advanced;
    if (years >= EXPERIENCE_THRESHOLDS.Intermediate) return ExperienceLevel.Intermediate;
    return ExperienceLevel.Beginner;
  }
}
