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
            details: "Led TypeScript/Angular development. Integrated WhatsApp into CRM and implemented Amplitude tracking. Personally introduced the CRM system to sales points, ensuring adoption by staff and management.",
            projects: ["CRM System", "Analytics Dashboard", "Recommendation Service"],
            metrics: [
              { label: "Conversion Rate", value: "~22%" },
              { label: "Render Time", value: "~75%" },
              { label: "Engagement Growth", value: "~18%" },
              { label: "Bug Reduction", value: "~35%" }
            ]
          },
          {
            company: "Sigli/Copaco.com",
            period: "2024 - Present",
            details: "Refactored legacy codebase and implemented new features to enhance user experience and maintainability.",
            projects: ["E-commerce Platform", "Admin Dashboard"],
            metrics: [
              { label: "Code Refactored", value: "100K+ lines" },
              { label: "Performance Gain", value: "~35%" }
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
            details: "Built accurate web scrapers and scalable APIs.",
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
            details: "Led Angular project development from scratch. Created a fully functional product that generated revenue and was adopted by five major brands.",
            projects: ["WhatsApp CRM Integration", "Analytics Dashboard", "Recommendation Service"],
            metrics: [
              { label: "Customer Journey Visibility", value: "~15%" },
              { label: "Revenue Impact", value: "Direct monetization" }
            ]
          },
          {
            company: "Sigli/Copaco.com",
            period: "2024 - Present",
            details: "Maintained large-scale webshop and implemented UX improvements.",
            projects: ["E-commerce Platform", "Component Library"],
            metrics: [
              { label: "Code Quality", value: "~38%" },
              { label: "User Satisfaction", value: "~28%" }
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
            details: "Built scalable LMS platform using MERN stack.",
            projects: ["Learning Management System", "Interactive Exercises"],
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
            details: "Implemented and maintained Backend-for-Frontend (BFF) services. Supported Node.js server for telephony systems, focusing on fixes and minor enhancements.",
            projects: ["BFF Services", "Telephony Integration"],
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
            details: "Created scalable REST APIs and services.",
            projects: ["REST API Platform", "Data Processing Service"],
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
            details: "Developed cross-platform games and applications with a focus on gamified experiences.",
            projects: ["Business Tycoon Game", "Task Manager RPG"],
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
