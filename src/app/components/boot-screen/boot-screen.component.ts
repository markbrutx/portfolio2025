import {
  Component,
  output,
  inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  PLATFORM_ID,
  NgZone
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-boot-screen',
  templateUrl: './boot-screen.component.html',
  styleUrls: ['./boot-screen.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BootScreenComponent implements OnInit {
  userReady = output<void>();

  progress = 0;
  splashScreenHidden = false;
  totalDuration = 1000;

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);

  constructor() {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.startProgress();
    } else {
      this.userReady.emit();
    }
  }

  private startProgress() {
    this.progress = 0;
    const interval = 10;
    const step = (100 / this.totalDuration) * interval;

    this.ngZone.runOutsideAngular(() => {
      const timer = setInterval(() => {
        this.progress += step;
        this.ngZone.run(() => {
          this.cdr.markForCheck();
        });

        if (this.progress >= 100) {
          clearInterval(timer);
          this.finishLoading();
        }
      }, interval);
    });
  }

  private finishLoading() {
    this.splashScreenHidden = true;
    this.cdr.markForCheck();
    
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.ngZone.run(() => {
          this.userReady.emit();
        });
      }, 300);
    });
  }
}
