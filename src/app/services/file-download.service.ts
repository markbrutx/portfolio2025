import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileDownloadService {
  /**
   * Triggers download for a given file path
   * @param fileUrl - URL of the file
   * @param fileName - Name for the downloaded file
   */
  async downloadFile(fileUrl: string, fileName: string): Promise<void> {
    if (!fileUrl || !fileName) {
      console.error('Invalid file URL or file name');
      return;
    }

    try {
      const response = await fetch(fileUrl, { method: 'HEAD' });
      if (!response.ok) {
        throw new Error(`File not found at ${fileUrl}`);
      }

      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      link.click();
      link.remove();

    } catch (error) {
      console.error('File download failed:', error);
    }
  }
}
