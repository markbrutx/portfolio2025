import { Injectable } from '@angular/core';
import { Position } from '../../models/desktop.models';
import { AppStateService } from '../../state/app-state.service';

@Injectable({ providedIn: 'root' })
export class WindowStyleService {
  private previousStyle: { width: string; height: string; transform: string; zIndex: string } = {
    width: '',
    height: '',
    transform: '',
    zIndex: 'auto',
  };

  constructor(private appStateService: AppStateService) {}

  updatePosition(windowElement: HTMLElement, position: Position): void {
    windowElement.style.transform = `translate(${position.x}px, ${position.y}px)`;
  }

  enableSmoothTransition(windowElement: HTMLElement): void {
    windowElement.style.transition = 'width 0.3s ease, height 0.3s ease, transform 0.3s ease';
  }

  disableSmoothTransition(windowElement: HTMLElement): void {
    windowElement.style.transition = 'none';
  }

  startDrag(
    event: MouseEvent,
    initialPosition: Position,
    windowElement: HTMLElement,
    updatePosition: (newPosition: Position) => void
  ): void {
    const { clientX: startX, clientY: startY } = event;
    const { x: initialX, y: initialY } = initialPosition;

    this.disableSmoothTransition(windowElement);
    this.appStateService.setState({ isDragging: true});

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      updatePosition({ x: initialX + deltaX, y: initialY + deltaY });
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      this.appStateService.setState({ isDragging: false });
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  toggleMaximize(
    windowElement: HTMLElement,
    isMaximized: boolean,
    width: number,
    height: number,
    appId: string,
    position: Position
  ): boolean {
    if (!isMaximized) {
      this.previousStyle = {
        width: windowElement.style.width,
        height: windowElement.style.height,
        transform: windowElement.style.transform,
        zIndex: windowElement.style.zIndex,
      };

      this.enableSmoothTransition(windowElement);

      windowElement.style.width = '100%';
      windowElement.style.height = '100%';
      windowElement.style.transform = `translate(0, 0)`;
      windowElement.style.zIndex = '1000';
      this.appStateService.setState({ maximizedWindowId: appId });
    } else {
      this.enableSmoothTransition(windowElement);

      windowElement.style.width = this.previousStyle.width || `${width}px`;
      windowElement.style.height = this.previousStyle.height || `${height}px`;
      windowElement.style.transform =
        this.previousStyle.transform || `translate(${position.x}px, ${position.y}px)`;
      windowElement.style.zIndex = this.previousStyle.zIndex || 'auto';
      this.appStateService.setState({ maximizedWindowId: null });
    }
    return !isMaximized;
  }
}
