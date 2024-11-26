export enum ExperienceLevel {
  Beginner = 'experience-beginner',
  Intermediate = 'experience-intermediate',
  Advanced = 'experience-advanced',
  Expert = 'experience-expert'
}

export const EXPERIENCE_THRESHOLDS = {
  Expert: 4,
  Advanced: 3,
  Intermediate: 2,
  Beginner: 0
} as const;

export const LEVEL_RANGES = {
  Beginner: { min: 0, max: 50 },
  Intermediate: { min: 51, max: 75 },
  Advanced: { min: 76, max: 90 },
  Expert: { min: 91, max: 100 }
} as const;
