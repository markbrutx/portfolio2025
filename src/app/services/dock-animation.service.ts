import { Injectable, inject, PLATFORM_ID, signal, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { DockItem } from '../models/dock-item.model';
import { AppStateService } from '../state/app-state.service';

interface MousePosition {
  x: number | null;
  y: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class DockAnimationService implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly appStateService = inject(AppStateService);

  private readonly config = {
    baseWidth: 64,
    distanceLimit: 64 * 6,
    distances: [
      0,          // Center
      64,         // Near zone
      64 * 2,     // Medium zone
      64 * 3,     // Far zone
      64 * 4,     // Very far zone
      64 * 5,     // Almost no effect
      64 * 6      // No effect
    ],
    scales: [
      2,      // Maximum scale at center
      1.7,    // Near zone
      1.4,    // Medium zone
      1.2,    // Far zone
      1.1,    // Very far zone
      1.05,   // Almost no effect
      1       // No effect
    ]
  } as const;

  private animationFrame: number | null = null;
  private readonly itemsSubject = new BehaviorSubject<DockItem[]>([]);
  private readonly isDragging = signal<boolean>(false);
  private mousePosition: MousePosition = { x: null, y: null };
  private isAnimating = false;

  readonly items$ = this.itemsSubject.asObservable();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.startAnimation();
      this.appStateService.state$.subscribe(state => {
        this.isDragging.set(state.isDragging);
      });
    }
  }

  setItems(items: DockItem[]): void {
    this.itemsSubject.next(items);
  }

  setMousePosition(x: number | null, y: number | null): void {
    if (this.isDragging()) return;

    this.mousePosition = { x, y };
    this.isAnimating = x !== null && y !== null;

    if (!this.isAnimating) {
      const items = this.itemsSubject.value;
      this.updateItemsScale(items.map(item => ({ ...item, scale: 1 })));
    }
  }

  private startAnimation(): void {
    const animate = () => {
      if (this.isAnimating && !this.isDragging()) {
        const items = this.itemsSubject.value;
        const updatedItems = items.map(item => ({
          ...item,
          scale: this.calculateScale(item)
        }));

        this.updateItemsScale(updatedItems);
      }
      this.animationFrame = requestAnimationFrame(animate);
    };

    this.animationFrame = requestAnimationFrame(animate);
  }

  private calculateScale(item: DockItem): number {
    const element = document.getElementById(`dock-item-${item.appId}`);
    if (!element || !this.mousePosition.x) return 1;

    const rect = element.getBoundingClientRect();
    const itemCenterX = rect.left + (rect.width / 2);
    const distance = Math.abs(this.mousePosition.x - itemCenterX);

    if (distance > this.config.distanceLimit) return 1;

    return this.interpolateScale(distance);
  }

  private interpolateScale(distance: number): number {
    const { distances, scales } = this.config;

    let i = 0;
    while (i < distances.length && distances[i] < distance) {
      i++;
    }

    if (i === 0) return scales[0];
    if (i === distances.length) return scales[scales.length - 1];

    const x0 = distances[i - 1];
    const x1 = distances[i];
    const y0 = scales[i - 1];
    const y1 = scales[i];

    const t = (distance - x0) / (x1 - x0);
    return y0 + (y1 - y0) * Math.max(0, Math.min(1, t));
  }

  private updateItemsScale(items: DockItem[]): void {
    this.itemsSubject.next(items);
  }

  ngOnDestroy(): void {
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
}
