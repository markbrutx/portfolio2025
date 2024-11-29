import {
  Component,
  output,
  inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  PLATFORM_ID
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

    const timer = setInterval(() => {
      this.progress += step;
      this.cdr.markForCheck();

      if (this.progress >= 100) {
        clearInterval(timer);
        this.finishLoading();
      }
    }, interval);
  }

  private finishLoading() {
    this.splashScreenHidden = true;
    this.cdr.markForCheck();
    setTimeout(() => {
      this.userReady.emit();
    }, 300);
  }
}
