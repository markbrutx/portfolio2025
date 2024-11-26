import { EXPERIENCE_THRESHOLDS, LEVEL_RANGES } from '../constants/experience-levels.enum';
import { SkillsData } from '../models/skills.model';

const validateSkillLevel = (level: number): number => {
  if (level < LEVEL_RANGES.Beginner.min) return LEVEL_RANGES.Beginner.min;
  if (level > LEVEL_RANGES.Expert.max) return LEVEL_RANGES.Expert.max;
  return level;
};

const createSkillsData = (): Readonly<SkillsData> => ({
  languages: {
    title: "Programming Languages",
    icon: "💻",
    skills: [
      {
        name: "TypeScript/JavaScript",
        level: validateSkillLevel(95),
        experiences: [
          {
            company: "ht.kz",
            period: "2020 - 2024",
            details: "Led TypeScript/Angular development from scratch. Introduced and implemented a CRM system across sales points, collaborating with sales managers for adoption. Built numerous features such as chats, interaction histories, notifications, and voice messaging. Developed ZenMode to streamline sales workflows and reduce cognitive load, and mentored junior developers.",
            projects: ["CRM System", "ZenMode", "Internal Messenger"],
            metrics: [
              { label: "Conversion Rate", value: "~22%" },
              { label: "Cognitive Load Reduction", value: "Significant" },
              { label: "Feature Adoption", value: "~95%" },
              { label: "Bug Reduction", value: "~35%" }
            ]
          },
          {
            company: "Sigli/Copaco.com",
            period: "2024 - Present",
            details: "Redesigned user interfaces for over 20 sections of the e-commerce platform, strictly adhering to style guides with pixel-perfect precision.",
            projects: ["E-commerce Platform Redesign"],
            metrics: [
              { label: "Pages Redesigned", value: "20+" },
              { label: "Guideline Compliance", value: "100%" }
            ]
          }
        ],
        years: EXPERIENCE_THRESHOLDS.Expert,
        icon: "🔷"
      },
      {
        name: "Python",
        level: validateSkillLevel(90),
        experiences: [
          {
            company: "NDA Companies",
            period: "2018 - 2019",
            details: "Built accurate web scrapers and scalable APIs, and developed Telegram bots to streamline content posting.",
            projects: ["Web Scrapers", "REST APIs", "Telegram Bots"],
            metrics: [
              { label: "Data Accuracy", value: "99.5%" },
              { label: "Daily Requests", value: "10K+" }
            ]
          }
        ],
        years: EXPERIENCE_THRESHOLDS.Advanced,
        icon: "🐍"
      }
    ]
  },
  frontend: {
    title: "Frontend Technologies",
    icon: "🎨",
    skills: [
      {
        name: "Angular",
        level: validateSkillLevel(98),
        experiences: [
          {
            company: "ht.kz",
            period: "2020 - 2024",
            details: "Led Angular development for CRM and desktop applications, working closely with UI/UX designers and adhering to strict style guides. Integrated features like chats, ZenMode, and voice messaging.",
            projects: ["CRM System", "ZenMode", "Internal Messenger"],
            metrics: [
              { label: "Conversion Rate", value: "~22%" },
              { label: "Cognitive Load Reduction", value: "Significant" },
              { label: "Feature Adoption", value: "~95%" },
              { label: "Bug Reduction", value: "~35%" }
            ]
          },
          {
            company: "Sigli/Copaco.com",
            period: "2024 - Present",
            details: "Redesigned e-commerce platform UI/UX and implemented improvements to user satisfaction.",
            projects: ["E-commerce Platform", "Component Library"],
            metrics: [
              { label: "Pages Redesigned", value: "20+" },
              { label: "Guideline Compliance", value: "100%" }
            ]
          }
        ],
        years: EXPERIENCE_THRESHOLDS.Expert,
        icon: "🅰️"
      },
      {
        name: "React",
        level: validateSkillLevel(85),
        experiences: [
          {
            company: "Parakozm",
            period: "2019 - 2020",
            details: "Developed a scalable LMS platform with MERN stack, enhancing user engagement and system scalability.",
            projects: ["Learning Management System"],
            metrics: [
              { label: "Session Duration", value: "~18%" },
              { label: "Scalability", value: "~50%" }
            ]
          }
        ],
        years: EXPERIENCE_THRESHOLDS.Intermediate,
        icon: "⚛️"
      }
    ]
  },
  backend: {
    title: "Backend Development",
    icon: "⚙️",
    skills: [
      {
        name: "Node.js/NestJS",
        level: validateSkillLevel(90),
        experiences: [
          {
            company: "ht.kz",
            period: "2020 - 2024",
            details: "Implemented and maintained BFF services and backend systems for CRM and desktop applications, focusing on integration and performance.",
            projects: ["BFF Services", "CRM Backend"],
            metrics: []
          }
        ],
        years: EXPERIENCE_THRESHOLDS.Advanced,
        icon: "🟢"
      },
      {
        name: "Django",
        level: validateSkillLevel(85),
        experiences: [
          {
            company: "NDA Companies",
            period: "2018 - 2019",
            details: "Built scalable APIs and backend systems for data processing.",
            projects: ["API Development", "Data Processing"],
            metrics: [
              { label: "API Performance", value: "~65%" },
              { label: "Data Accuracy", value: "99.5%" }
            ]
          }
        ],
        years: EXPERIENCE_THRESHOLDS.Intermediate,
        icon: "🎯"
      }
    ]
  },
  mobile: {
    title: "Mobile Development",
    icon: "📱",
    skills: [
      {
        name: "Ionic/Angular",
        level: validateSkillLevel(88),
        experiences: [
          {
            company: "B2B Contract (Part-Time Projects)",
            period: "2021",
            details: "Developed cross-platform applications and gamified tools.",
            projects: ["Gamified Task Manager"],
            metrics: []
          }
        ],
        years: EXPERIENCE_THRESHOLDS.Intermediate,
        icon: "⚡"
      }
    ]
  }
});
export const SKILLS_DATA = createSkillsData();
