import { Component, TrackByFunction, inject } from '@angular/core';
import { AnalyticsService } from '../../../services/analytics.service';
import { AnalyticsEvent } from '../../../constants/analytics.constants';

interface ProjectStat {
  icon: string;
  text: string;
}

interface Project {
  id: string;
  title: string;
  shortDesc: string;
  icon: string;
  stats: ProjectStat[];
  tech: string[];
  content: string;
  videoUrl?: string;
  videoTitle?: string;
}

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
  activeProject: string | null = null;
  private readonly analyticsService = inject(AnalyticsService);

  projectsNote = `Please note: While these projects effectively solve real problems 
    and have potential for wider use as startups, they are currently maintained as personal solutions 
    due to resource constraints for full deployment.`;

  projects: Project[] = [
    {
      id: 'leetcode',
      title: '100 Days of LeetCode Challenge',
      shortDesc: 'Daily algorithm challenges live-streamed on YouTube',
      icon: 'brain',
      stats: [
        { icon: 'trophy', text: '100 Problems Solved' },
        { icon: 'youtube-logo', text: '100+ Hours Streamed' }
      ],
      tech: ['Python', 'JavaScript'],
      content: `At the beginning of my YouTube journey, I embarked on an ambitious challenge: 
        solving one LeetCode problem every day for 100 days, all while streaming live. 
        This project combined my passion for algorithms with community building, allowing 
        viewers to learn alongside me as I tackled each problem.`,
      videoUrl: 'https://www.youtube.com/playlist?list=PL0puOaqubY8275fuijwzgafsEub4yXL9m',
      videoTitle: 'Watch my LeetCode journey (100+ videos)'
    },
    {
      id: 'street-kid',
      title: 'Street Kid',
      shortDesc: 'Online browser-based business tycoon game',
      icon: 'game-controller',
      stats: [
        { icon: 'users', text: 'Product Owner' },
        { icon: 'google-chrome-logo', text: 'Browser Game' }
      ],
      tech: ['Next.js', 'Django', 'Redis', 'Celery'],
      content: `A browser-based online game targeting the CIS audience, developed with the strong belief in the untapped 
        potential of the browser gaming market. This belief has been validated by the later success of games like 
        Hamster Kombat in the Telegram ecosystem. As the Product Owner, I initially handled all aspects including Frontend, Backend, 
        game design, UI/UX, and collaboration with illustrators. The game focuses on business tycoon mechanics and 
        adventurism, featuring an engaging gameplay loop that appeals to the target demographic.`,
      videoUrl: 'https://www.youtube.com/watch?v=8_haUl5WMK4',
      videoTitle: 'Watch Street Kid Demo'
    },
    {
      id: 'ranobe',
      title: 'RanobeRead',
      shortDesc: 'Personal web novel reader with AI-powered translations',
      icon: 'books',
      stats: [
        { icon: 'books', text: '1700+ Chapters' },
        { icon: 'open-ai-logo', text: 'AI Translation' }
      ],
      tech: ['Python', 'Node.js', 'Next.js', 'FastAPI', 'OpenAI API'],
      content: `After falling in love with "Losing Money To Be a Tycoon", I found myself frustrated 
        with the lack of quality translations. This inspired me to create RanobeRead - my 
        personal web novel reader that uses OpenAI to translate directly from Chinese. 
        The project grew to over 1,700 chapters, becoming my daily companion for reading 
        across all devices until I switched to an e-reader.`,
      videoUrl: 'https://youtube.com/shorts/srnLVP-fKZo',
      videoTitle: 'Watch short demo of RanobeRead'
    },
    {
      id: 'resume-enhancer',
      title: 'ResumeEnhancer',
      shortDesc: 'AI-powered resume and cover letter optimization tool',
      icon: 'read-cv-logo',
      stats: [
        { icon: 'open-ai-logo', text: 'OpenAI Integration' },
        { icon: 'read-cv-logo', text: 'Personalized Resumes' }
      ],
      tech: ['NodeJS', 'OpenAI API'],
      content: `A sophisticated tool designed to optimize resumes for better job application success. 
        The project helps customize resumes to match specific job requirements and pass AI-based 
        screening systems. It also generates tailored cover letters based on company needs, 
        increasing the chances of landing interviews.`,
      videoUrl: 'https://youtu.be/26wX1xBlkOs',
      videoTitle: 'Watch short demo of ResumeEnhancer'
    },
    {
      id: 'application-tracker',
      title: 'ApplicationTracker',
      shortDesc: 'Desktop utility for tracking job applications with hotkeys',
      icon: 'checks',
      stats: [
        { icon: 'keyboard', text: 'Hotkey Support' },
        { icon: 'chart-pie-slice', text: 'Application Analytics' }
      ],
      tech: ['Python', 'Tkinter'],
      content: `A lightweight desktop application built to streamline the job application process. 
        Features include hotkey-based tracking, application counting, and engaging sound effects 
        for achievement streaks. This tool was born from a personal need during intense job 
        searching periods.`,
      videoUrl: 'https://youtu.be/9cDuM8aH5Lw',
      videoTitle: 'Watch short demo of ApplicationTracker'
    },
    
  ];

  trackProject: TrackByFunction<Project> = (index: number, project: Project) => project.id;

  setActiveProject(projectId: string | null): void {
    this.activeProject = projectId;
    if (projectId) {
      this.analyticsService.trackUserInteraction(AnalyticsEvent.PROJECT_OPENED, { projectId });
    }
  }

  watchVideo(projectId: string, videoUrl: string): void {
    this.analyticsService.trackUserInteraction(AnalyticsEvent.PROJECT_VIDEO_WATCHED, { 
      projectId,
      videoUrl 
    });
  }

  isProjectActive(projectId: string): boolean {
    return this.activeProject === projectId;
  }
}
