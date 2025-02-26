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
            company: "tny.",
            period: "Dec 2024 - Present",
            details: "Developed high-performance dashboard for order management (150,000+ orders/month). Optimized performance with advanced filtering and ensured system stability under high load. Led architectural and technical decisions for an adaptive interface to manage orders and subscriptions.",
            projects: ["Project SMT", "Project CSMP"],
            metrics: [
              { label: "Orders Processed", value: "150,000+/month" },
              { label: "Performance", value: "Optimized" },
            ]
          },
          {
            company: "Sigli/Copaco.com",
            period: "Feb 2024 - Feb 2025",
            details: "Redesigned over 20 client-facing pages and refactored 100,000+ lines of legacy code to boost performance and maintainability. Implemented new features and contributed to architectural decisions for enhanced scalability and system stability within an international team.",
            projects: ["E-commerce Platform Redesign"],
            metrics: [
              { label: "Pages Redesigned", value: "20+" },
              { label: "Code Refactored", value: "100,000+ lines" }
            ]
          },
          {
            company: "ht.kz",
            period: "May 2020 - Mar 2024",
            details: "Led TypeScript/Angular development from scratch. Introduced and implemented a CRM system across sales points, collaborating with sales managers for adoption. Built numerous features such as chats, interaction histories, notifications, and voice messaging. Developed ZenMode to streamline sales workflows and reduce cognitive load, and mentored junior developers.",
            projects: ["CRM System", "ZenMode", "Internal Messenger"],
            metrics: [
              { label: "Conversion Rate", value: "~22%" },
              { label: "Cognitive Load Reduction", value: "Significant" },
              { label: "Feature Adoption", value: "~95%" },
              { label: "Bug Reduction", value: "~35%" }
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
            period: "Feb 2018 - Nov 2019",
            details: "Designed advanced web scrapers using Selenium and BeautifulSoup4, built robust APIs with Django Rest Framework, and developed Telegram bots to automate content posting.",
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
            company: "Sigli/Copaco.com",
            period: "Feb 2024 - Feb 2025",
            details: "Redesigned over 20 client-facing pages and refactored legacy code to boost performance and maintainability. Worked within an international team on architectural decisions for enhanced scalability.",
            projects: ["E-commerce Platform", "Component Library"],
            metrics: [
              { label: "Pages Redesigned", value: "20+" },
              { label: "Code Quality", value: "Improved" }
            ]
          },
          {
            company: "ht.kz",
            period: "May 2020 - Mar 2024",
            details: "Integrated WhatsApp, implemented Amplitude tracking, optimized performance through code refactoring, and enhanced telephony management with improved notifications and direct call capabilities. Fixed critical bugs and fully integrated the travel search engine with the CRM for seamless data synchronization.",
            projects: ["CRM System", "ZenMode", "Travel Search Engine"],
            metrics: [
              { label: "Conversion Rate", value: "~22%" },
              { label: "Feature Adoption", value: "~95%" },
              { label: "Bug Reduction", value: "~35%" }
            ]
          }
        ],
        years: EXPERIENCE_THRESHOLDS.Expert,
        icon: "🅰️"
      },
      {
        name: "React",
        level: validateSkillLevel(95),
        experiences: [
          {
            company: "tny.",
            period: "Dec 2024 - Present",
            details: "Developed a high-performance dashboard for order management and created dynamic UIs for order modifications and cancellations. Delivered scalable solutions for onboarding new brands.",
            projects: ["Project SMT", "Project CSMP"],
            metrics: [
              { label: "Orders Processed", value: "150,000+/month" },
              { label: "Scalability", value: "Enhanced" }
            ]
          },
          {
            company: "Sigli/Copaco.com",
            period: "Feb 2024 - Feb 2025",
            details: "Contributed to the React components of the e-commerce platform and implemented new features to enhance user experience.",
            projects: ["E-commerce Platform"],
            metrics: [
              { label: "User Experience", value: "Improved" }
            ]
          },
          {
            company: "Parakozm",
            period: "Nov 2019 - Apr 2020",
            details: "Developed a scalable LMS platform with MERN stack, enhancing user engagement and system scalability. Designed intuitive interfaces and provided input on key architectural decisions.",
            projects: ["Learning Management System"],
            metrics: [
              { label: "Session Duration", value: "~18%" },
              { label: "Scalability", value: "~50%" }
            ]
          }
        ],
        years: EXPERIENCE_THRESHOLDS.Expert,
        icon: "⚛️"
      },
      {
        name: "Next.js",
        level: validateSkillLevel(85),
        experiences: [
          {
            company: "tny.",
            period: "Dec 2024 - Present",
            details: "Used Next.js for building high-performance web applications with server-side rendering capabilities. Created adaptive interfaces for order management systems.",
            projects: ["Project SMT", "Project CSMP"],
            metrics: [
              { label: "Performance", value: "Optimized" }
            ]
          }
        ],
        years: EXPERIENCE_THRESHOLDS.Intermediate,
        icon: "🔼"
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
            period: "May 2020 - Mar 2024",
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
            period: "Feb 2018 - Nov 2019",
            details: "Built scalable APIs and backend systems for data processing with Django Rest Framework.",
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
  },
  other: {
    title: "Other Technologies",
    icon: "🧰",
    skills: [
      {
        name: "Tailwind CSS",
        level: validateSkillLevel(85),
        experiences: [
          {
            company: "tny.",
            period: "Dec 2024 - Present",
            details: "Utilized Tailwind CSS for rapid UI development and consistent styling across projects.",
            projects: ["Project SMT", "Project CSMP"],
            metrics: []
          }
        ],
        years: EXPERIENCE_THRESHOLDS.Intermediate,
        icon: "🎨"
      },
      {
        name: "Vite",
        level: validateSkillLevel(82),
        experiences: [
          {
            company: "tny.",
            period: "Dec 2024 - Present",
            details: "Leveraged Vite for fast development and optimized production builds.",
            projects: ["Project SMT", "Project CSMP"],
            metrics: [
              { label: "Build Performance", value: "Significantly Improved" }
            ]
          }
        ],
        years: EXPERIENCE_THRESHOLDS.Intermediate,
        icon: "⚡"
      }
    ]
  }
});
export const SKILLS_DATA = createSkillsData();