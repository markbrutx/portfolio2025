import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class FileDownloadService {
  /**
   * Triggers download for a given file path
   * @param filePath
   * @param fileName - Name for the downloaded file
   */
  downloadFile(filePath: string, fileName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const link = document.createElement('a')
        link.href = filePath
        link.download = fileName
        link.click()
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }

}
