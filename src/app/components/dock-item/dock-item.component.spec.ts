import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { DockItemComponent } from './dock-item.component'

describe('DockItemComponent', () => {
  let component: DockItemComponent
  let fixture: ComponentFixture<DockItemComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DockItemComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(DockItemComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create the component', () => {
    expect(component).toBeTruthy()
  })

  describe('Inputs', () => {
    it('should set default values correctly', () => {
      expect(component.iconSrc).toBe('')
      expect(component.label).toBe('')
      expect(component.index).toBe(0)
      expect(component.isActive).toBeFalse()
      expect(component.scale).toBe(1)
    })

    it('should update sizeRem based on scale input', () => {
      component.scale = 2
      component.ngOnChanges()
      expect(component.sizeRem).toBe(8)
    })

    it('should adjust transition duration based on scale change direction', () => {
      component.scale = 2
      component.ngOnChanges()
      expect(component.transitionDuration).toBe('0.1s')

      component.scale = 1
      component.ngOnChanges()
      expect(component.transitionDuration).toBe('0.3s')
    })
  })

  describe('Tooltip visibility', () => {
    it('should show tooltip on mouseenter', () => {
      component.showTooltip()
      expect(component.tooltipVisible).toBeTrue()
    })

    it('should hide tooltip on mouseleave', () => {
      component.showTooltip()
      component.hideTooltip()
      expect(component.tooltipVisible).toBeFalse()
    })
  })

  describe('Click events', () => {
    it('should emit clicked event on click', () => {
      spyOn(component.clicked, 'emit')
      component.onClick()
      expect(component.clicked.emit).toHaveBeenCalled()
    })

    it('should call onClick when dock item is clicked', () => {
      spyOn(component, 'onClick')
      const dockItemElement = fixture.debugElement.query(By.css('.dock-item'))
      dockItemElement.triggerEventHandler('click', null)
      expect(component.onClick).toHaveBeenCalled()
    })
  })

  describe('DOM Rendering', () => {
    it('should render the icon image with correct src and alt', () => {
      component.iconSrc = 'test-icon.png'
      component.label = 'Test Icon'
      fixture.detectChanges()

      const imgElement = fixture.debugElement.query(By.css('.icon-wrapper img'))
      expect(imgElement.attributes['src']).toBe('test-icon.png')
      expect(imgElement.attributes['alt']).toBe('Test Icon')
    })

    it('should apply tooltip visibility class based on tooltipVisible', async () => {
      component.tooltipVisible = true
      fixture.detectChanges()
      await fixture.whenStable()

      const tooltipElement = fixture.debugElement.query(By.css('.tooltip'))
      expect(tooltipElement.classes['visible']).toBeTrue()

      component.tooltipVisible = false
      fixture.detectChanges()
      await fixture.whenStable()

      expect(tooltipElement.classes['visible']).toBeFalse()
    })

    it('should conditionally render the active indicator', () => {
      component.isActive = true
      fixture.detectChanges()
      expect(
        fixture.debugElement.query(By.css('.active-indicator'))
      ).toBeTruthy()

      component.isActive = false
      fixture.detectChanges()
      expect(
        fixture.debugElement.query(By.css('.active-indicator'))
      ).toBeFalsy()
    })

    it('should set custom styles for width and scale', () => {
      component.scale = 1.5
      fixture.detectChanges()

      const dockItemElement = fixture.debugElement.query(
        By.css('.dock-item')
      ).nativeElement
      const styles = getComputedStyle(dockItemElement)

      expect(styles.getPropertyValue('--scale')).toBe('1.5')
      expect(styles.width).toBe('6rem') // 4rem * 1.5
    })
  })
})
