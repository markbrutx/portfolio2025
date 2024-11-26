export interface BaseExperience {
  readonly id: string;
  readonly company: string;
  readonly role: string;
  readonly location: string;
  readonly period: {
    readonly start: string;
    readonly end: string;
  };
  readonly stack: readonly string[];
  readonly achievements: readonly string[];
  readonly iconPath: string;
}

export interface ExperienceViewModel extends BaseExperience {
  readonly companyColor: string;
  readonly companyLightColor: string;
  readonly isActive: boolean;
}
