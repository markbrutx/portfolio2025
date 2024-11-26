import { ExperienceLevel } from '../constants/experience-levels.enum';

export type MetricValue = {
  readonly label: string;
  readonly value: string;
};

export type Experience = Readonly<{
  company: string;
  period: string;
  details: string;
  projects: ReadonlyArray<string>;
  metrics: ReadonlyArray<MetricValue>;
}>;

export type BaseSkill = Readonly<{
  name: string;
  icon: string;
  level: number;
  years: number;
  experiences: ReadonlyArray<Experience>;
}>;

export interface SkillViewModel extends BaseSkill {
  readonly experienceLevel: ExperienceLevel;
}

export type SkillCategory = Readonly<{
  title: string;
  icon: string;
  skills: ReadonlyArray<BaseSkill>;
}>;

export type SkillsData = Readonly<{
  [K: string]: SkillCategory;
}>;

export interface CategoryViewModel {
  readonly key: string;
  readonly category: Readonly<{
    title: string;
    icon: string;
    skills: ReadonlyArray<SkillViewModel>;
  }>;
}
