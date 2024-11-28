import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class FileDownloadService {
  private readonly CV_PATH = '/assets/cv.pdf';
  private readonly CV_FILENAME = 'Magzhan_CV.pdf';

  /**
   * Downloads the CV file
   * @returns Promise that resolves when download starts
   */
  async downloadCV(): Promise<void> {
    try {
      await this.downloadFile(this.CV_PATH, this.CV_FILENAME);
    } catch (error) {
      console.error('Failed to download CV:', error);
      throw error;
    }
  }

  /**
   * Triggers download for a given file path
   * @param filePath - Path to the file to download
   * @param fileName - Name for the downloaded file
   * @returns Promise that resolves when download starts
   */
  private downloadFile(filePath: string, fileName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const link = document.createElement('a');
        link.href = filePath;
        link.download = fileName;
        link.click();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
}
