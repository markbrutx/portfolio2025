import { TestBed, ComponentFixture } from '@angular/core/testing'
import { DockPanelComponent, AppID } from './dock-panel.component'
import { FileDownloadService } from '../../services/file-download.service'
import { ChangeDetectorRef, ElementRef } from '@angular/core'

describe('DockPanelComponent', () => {
  let component: DockPanelComponent
  let fixture: ComponentFixture<DockPanelComponent>
  let fileDownloadServiceSpy: jasmine.SpyObj<FileDownloadService>
  let cdrSpy: jasmine.SpyObj<ChangeDetectorRef>

  beforeEach(async () => {
    fileDownloadServiceSpy = jasmine.createSpyObj('FileDownloadService', [
      'downloadFile',
    ])
    cdrSpy = jasmine.createSpyObj('ChangeDetectorRef', ['markForCheck'])

    await TestBed.configureTestingModule({
      declarations: [DockPanelComponent],
      providers: [
        { provide: FileDownloadService, useValue: fileDownloadServiceSpy },
        { provide: ChangeDetectorRef, useValue: cdrSpy },
        {
          provide: ElementRef,
          useValue: { nativeElement: document.createElement('div') },
        },
      ],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(DockPanelComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should call downloadCV when AppID.CV is passed to openApp', async () => {
    spyOn(component, 'downloadCV')
    component.openApp(AppID.CV)
    expect(component.downloadCV).toHaveBeenCalled()
  })

  it('should call FileDownloadService.downloadFile in downloadCV', async () => {
    const cvPath = '/assets/cv.pdf'
    await component.downloadCV()
    expect(fileDownloadServiceSpy.downloadFile).toHaveBeenCalledWith(
      cvPath,
      'Magzhan_CV.pdf'
    )
  })

  it('should log error if downloadCV fails', async () => {
    fileDownloadServiceSpy.downloadFile.and.throwError('Test error')
    spyOn(console, 'error')
    await component.downloadCV()
    expect(console.error).toHaveBeenCalledWith(
      'Failed to download CV:',
      jasmine.any(Error)
    )
  })

  it('should reset dock item scales on mouse leave', () => {
    component.dockItems = [
      { iconSrc: '', label: '', scale: 1, appId: AppID.Home },
      { iconSrc: '', label: '', scale: 1.5, appId: AppID.CV },
    ]

    component.resetDockItemScales()

    component.dockItems.forEach((item) => expect(item.scale).toBe(1))
    expect(cdrSpy.markForCheck).toHaveBeenCalled()
  })

  it('should calculate correct scale factor based on distance', () => {
    const distance = 100
    const maxDistance = 450
    const minScale = 1
    const maxScale = 2

    const result = component.calculateScaleFactor(
      distance,
      maxDistance,
      minScale,
      maxScale
    )

    expect(result).toBeGreaterThan(1)
    expect(result).toBeLessThanOrEqual(maxScale)
  })

  it('should handle mousemove event correctly', () => {
    const mockEvent = new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 200,
    })
    spyOn(component, 'calculateScales')
    component.setupGlobalMouseMoveListener()
    window.dispatchEvent(mockEvent)
    expect(component.calculateScales).toHaveBeenCalledWith(100, 200)
  })
})
