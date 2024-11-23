import { TestBed } from '@angular/core/testing';
import { FileDownloadService } from './file-download.service';

describe('FileDownloadService', () => {
  let service: FileDownloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileDownloadService],
    });
    service = TestBed.inject(FileDownloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log an error if fileUrl or fileName is missing', async () => {
    spyOn(console, 'error');
    await service.downloadFile('', '');
    expect(console.error).toHaveBeenCalledWith('Invalid file URL or file name');
  });

  it('should log an error if the file is not found', async () => {
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(new Response(null, { status: 404 }))
    );
    spyOn(console, 'error');

    await service.downloadFile('/assets/non-existent.pdf', 'test.pdf');

    expect(console.error).toHaveBeenCalledWith(
      'File download failed:',
      jasmine.any(Error)
    );
  });

  it('should trigger file download if file exists', async () => {
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(new Response(null, { status: 200 }))
    );
    spyOn(document, 'createElement').and.callThrough();
    const clickSpy = jasmine.createSpy();
    spyOn(document.body, 'appendChild');
    const link = document.createElement('a');
    spyOn(link, 'click').and.callFake(clickSpy);

    await service.downloadFile('/assets/cv.pdf', 'cv.pdf');

    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(link.download).toBe('cv.pdf');
    expect(link.href).toBe('/assets/cv.pdf');
    expect(clickSpy).toHaveBeenCalled();
  });
});
