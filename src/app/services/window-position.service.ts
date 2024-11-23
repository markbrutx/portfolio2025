import { Injectable } from '@angular/core';
import {Position} from '../models/desktop.models';

@Injectable({ providedIn: 'root' })
export class WindowPositionService {
  ensureInBounds(
    position: Position,
    elementRect: DOMRect,
    containerWidth: number,
    containerHeight: number
  ): Position {
    const { x, y } = position;
    const clampedX = Math.max(0, Math.min(x, containerWidth - elementRect.width));
    const clampedY = Math.max(0, Math.min(y, containerHeight - elementRect.height));
    return { x: clampedX, y: clampedY };
  }
}
