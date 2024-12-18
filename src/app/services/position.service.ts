import { Injectable, Inject, PLATFORM_ID } from '@angular/core'
import { isPlatformBrowser } from '@angular/common'
import { Position } from '../models/desktop.models'

@Injectable({ providedIn: 'root' })
export class PositionService {
  private readonly positionOffset = 50

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  getCenterPosition(width: number, height: number): Position {
    if (isPlatformBrowser(this.platformId)) {
      const x = window.scrollX + (window.innerWidth - width) / 2
      const y = window.scrollY + (window.innerHeight - height) / 2
      return { x, y }
    }
    return { x: 0, y: 0 }
  }

  getNextPosition(
    openApps: { initialPosition?: Position }[],
    width: number,
    height: number
  ): Position {
    if (openApps.length === 0) {
      return this.getCenterPosition(width, height);
    }

    const currentOffset = this.positionOffset * openApps.length;
    let nextX = currentOffset;
    let nextY = currentOffset;

    if (nextX + width > window.innerWidth) {
      nextX = this.positionOffset;
      nextY = currentOffset;
    }

    if (nextY + height > window.innerHeight) {
      nextX = this.positionOffset;
      nextY = this.positionOffset;
    }

    return { x: nextX, y: nextY }
  }
}
