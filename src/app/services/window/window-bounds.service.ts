import { Injectable } from '@angular/core';
import { Position } from '../../models/desktop.models';

@Injectable({ providedIn: 'root' })
export class WindowBoundsService {
  enforceBounds(windowElement: HTMLElement, position: Position): Position {
    const container = document.querySelector('.windows-area');
    if (!container) return position;

    const rect = windowElement.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    return {
      x: Math.max(-200, Math.min(position.x, containerRect.width - rect.width + 200)),
      y: Math.max(0, Math.min(position.y, containerRect.height - rect.height + 200)),
    };
  }
}
