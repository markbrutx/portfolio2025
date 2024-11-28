import { Component, TrackByFunction } from '@angular/core';

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
    }
  ];

  trackProject: TrackByFunction<Project> = (index: number, project: Project) => project.id;

  setActiveProject(projectId: string) {
    this.activeProject = this.activeProject === projectId ? null : projectId;
  }

  isProjectActive(projectId: string): boolean {
    return this.activeProject === projectId;
  }
}