import { Injectable, inject, PLATFORM_ID, signal, OnDestroy, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { DockItem } from '../models/dock-item.model';
import { AppStateService } from '../state/app-state.service';

interface MousePosition {
  x: number | null;
  y: number | null;
}

interface DockAnimation {
  appId: string;
  scale: number;
  bounce: number;
}

@Injectable({
  providedIn: 'root'
})
export class DockAnimationService implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly appStateService = inject(AppStateService);
  private readonly ngZone = inject(NgZone);

  private readonly config = {
    baseWidth: 64,
    distanceLimit: 64 * 6,
    distanceInput: [
      0,              // Center
      64 * 1,         // Distance 1
      64 * 2,         // Distance 2
      64 * 3,         // Distance 3
      64 * 4,         // Distance 4
      64 * 5,         // Distance 5
      64 * 6          // Maximum distance
    ],
    scaleOutput: [
      2,              // Maximum scale at center (2x)
      1.414,          // Scale at distance 1 (√2)
      1.414,          // Scale at distance 2
      1.2,            // Scale at distance 3
      1.1,            // Scale at distance 4
      1.05,           // Scale at distance 5
      1               // No scaling at maximum distance
    ],
    bounce: {
      duration: 200,
      height: 40,
    }
  } as const;

  private animationFrame: number | null = null;
  private readonly itemsSubject = new BehaviorSubject<DockAnimation[]>([]);
  private readonly isDragging = signal<boolean>(false);
  private mousePosition: MousePosition = { x: null, y: null };
  private isAnimating = false;

  readonly items$ = this.itemsSubject.asObservable();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        this.startAnimation();
      });
      this.appStateService.state$.subscribe(state => {
        this.isDragging.set(state.isDragging);
      });
    }
  }

  setItems(items: DockItem[]): void {
    const animations = items.map(item => ({
      appId: item.appId,
      scale: 1,
      bounce: 0
    }));
    this.itemsSubject.next(animations);
  }

  setMousePosition(x: number | null, y: number | null): void {
    if (this.isDragging()) return;

    this.mousePosition = { x, y };
    this.isAnimating = x !== null && y !== null;

    if (!this.isAnimating) {
      const items = this.itemsSubject.value;
      this.updateItemsAnimation(items.map(item => ({ ...item, scale: 1 })));
    }
  }

  async triggerBounceAnimation(appId: string): Promise<void> {
    const items = this.itemsSubject.value;
    const itemIndex = items.findIndex(item => item.appId === appId);
    
    if (itemIndex === -1) return;

    const startTime = performance.now();
    const animate = () => {
      const currentTime = performance.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / this.config.bounce.duration, 1);
      
      const bounceHeight = Math.sin(progress * Math.PI) * this.config.bounce.height;
      
      const updatedItems = [...items];
      updatedItems[itemIndex] = { ...updatedItems[itemIndex], bounce: -bounceHeight };
      
      this.updateItemsAnimation(updatedItems);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        updatedItems[itemIndex] = { ...updatedItems[itemIndex], bounce: 0 };
        this.updateItemsAnimation(updatedItems);
      }
    };

    requestAnimationFrame(animate);
  }

  private startAnimation(): void {
    const animate = () => {
      if (this.isAnimating && !this.isDragging()) {
        const items = this.itemsSubject.value;
        const updatedItems = items.map(item => ({
          ...item,
          scale: this.calculateScale(item),
          bounce: item.bounce
        }));

        this.updateItemsAnimation(updatedItems);
      }
      this.animationFrame = requestAnimationFrame(animate);
    };

    this.animationFrame = requestAnimationFrame(animate);
  }

  private calculateScale(item: DockAnimation): number {
    const element = document.getElementById(`dock-item-${item.appId}`);
    if (!element || !this.mousePosition.x) return 1;

    const rect = element.getBoundingClientRect();
    const itemCenterX = rect.left + (rect.width / 2);
    const distance = Math.abs(this.mousePosition.x - itemCenterX);

    if (distance > this.config.distanceLimit) return 1;

    return this.interpolateScale(distance);
  }

  private interpolateScale(distance: number): number {
    const { distanceInput, scaleOutput } = this.config;
    
    let i = 0;
    while (i < distanceInput.length && distanceInput[i] < distance) {
      i++;
    }

    if (i === 0) return scaleOutput[0];
    if (i === distanceInput.length) return scaleOutput[scaleOutput.length - 1];

    const x0 = distanceInput[i - 1];
    const x1 = distanceInput[i];
    const y0 = scaleOutput[i - 1];
    const y1 = scaleOutput[i];

    const t = (distance - x0) / (x1 - x0);
    return y0 + (y1 - y0) * Math.max(0, Math.min(1, t));
  }

  private updateItemsAnimation(items: DockAnimation[]): void {
    this.itemsSubject.next(items);
  }

  ngOnDestroy(): void {
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
}
