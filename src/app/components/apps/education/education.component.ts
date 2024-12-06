import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../../services/analytics.service';
import { AnalyticsEvent } from '../../../constants/analytics.constants';

interface Achievement {
  metric: string;
  emoji: string;
  color: string;
  gradient: string;
  description: string;
  details: string[];
  image: string;
  imageAlt: string;
}

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EducationComponent {
  activeCard = signal<number | null>(null);
  selectedImage = signal<Achievement | null>(null);
  private readonly analyticsService = inject(AnalyticsService);

  mainAchievements: Achievement[] = [
    {
      metric: "Academic Performance",
      emoji: "📈",
      color: "violet",
      gradient: "violet-gradient",
      description: "Focused on consistent improvement",
      details: [
        "Earned a scholarship through hard work",
        "Completed studies with honors",
      ],
      image: "assets/backgrounds/random.webp",
      imageAlt: "Academic achievement representation"
    },
    {
      metric: "Community Work",
      emoji: "🤝",
      color: "blue",
      gradient: "blue-gradient",
      description: "Contributed to Komek Organization",
      details: [
        "Managed media content",
        "Participated in charity initiatives",
        "Supported fellow students"
      ],
      image: "assets/backgrounds/random.webp",
      imageAlt: "Community service activities"
    },
    {
      metric: "Activities",
      emoji: "🌱",
      color: "emerald",
      gradient: "emerald-gradient",
      description: "Engaged in diverse activities",
      details: [
        "Studied French language",
        "Joined ZhasOtan",
        "Participated in debate club",
        "Attended cultural events"
      ],
      image: "assets/backgrounds/random.webp",
      imageAlt: "Activities and events"
    }
  ];

  setActiveCard(index: number | null): void {
    const newState = index === this.activeCard() ? null : index;
    this.activeCard.set(newState);
    
    if (newState !== null) {
      this.analyticsService.trackUserInteraction(
        AnalyticsEvent.EDUCATION_DETAILS_EXPANDED,
        { achievementType: this.mainAchievements[newState].metric }
      );
    } else {
      const currentCard = this.activeCard();
      if (currentCard !== null) {
        this.analyticsService.trackUserInteraction(
          AnalyticsEvent.EDUCATION_DETAILS_COLLAPSED,
          { achievementType: this.mainAchievements[currentCard].metric }
        );
      }
    }
  }

  setSelectedImage(achievement: Achievement | null): void {
    this.selectedImage.set(achievement);
  }
}
