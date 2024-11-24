import { Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss'],
  standalone: true,
})
export class AboutMeComponent {
  @ViewChild('video', { static: true })
  videoElement!: ElementRef<HTMLVideoElement>


  playVideo(): void {
    const video = this.videoElement.nativeElement

    if (video.paused) {
      video.play()
    }
  }
}
