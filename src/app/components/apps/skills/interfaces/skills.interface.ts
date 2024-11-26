export interface Experience {
  company: string;
  period: string;
  details: string;
  projects: string[];
  metrics: Metric[];
}

export interface Metric {
  label: string;
  value: string;
}

export interface Skill {
  name: string;
  icon: string;
  level: number;
  years: number;
  experiences: Experience[];
}

export interface SkillCategory {
  title: string;
  icon: string;
  skills: Skill[];
}

export interface SkillsData {
  [key: string]: SkillCategory;
}
