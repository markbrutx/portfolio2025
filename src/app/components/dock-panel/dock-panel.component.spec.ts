import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DockPanelComponent } from './dock-panel.component';
import { DockItemComponent } from '../dock-item/dock-item.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('DockPanelComponent', () => {
  let component: DockPanelComponent;
  let fixture: ComponentFixture<DockPanelComponent>;
  let dockPanelDebugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DockPanelComponent, DockItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DockPanelComponent);
    component = fixture.componentInstance;
    dockPanelDebugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the correct number of dock items', () => {
    const dockItemElements = dockPanelDebugElement.queryAll(By.css('app-dock-item'));
    expect(dockItemElements.length).toBe(component.dockItems.length);
  });

  it('should display the correct label for each dock item', () => {
    const dockItemElements = dockPanelDebugElement.queryAll(By.css('app-dock-item'));
    dockItemElements.forEach((el, index) => {
      expect(el.componentInstance.label).toBe(component.dockItems[index].label);
    });
  });

  it('should invoke openApp() when a dock item is clicked', () => {
    spyOn(component, 'openApp');
    const firstDockItem = dockPanelDebugElement.query(By.css('app-dock-item'));
    firstDockItem.triggerEventHandler('click', null);
    expect(component.openApp).toHaveBeenCalledWith(component.dockItems[0].label);
  });

  it('should render dividers correctly based on shouldShowDivider()', () => {
    const dividerElements = dockPanelDebugElement.queryAll(By.css('.divider'));
    const expectedDividerCount = component.dockItems.filter((_, i) =>
      component.shouldShowDivider(i)
    ).length;
    expect(dividerElements.length).toBe(expectedDividerCount);
  });

  it('should correctly calculate scale factors', () => {
    const distance = 200;
    const maxDistance = 450;
    const minScale = 1;
    const maxScale = 2;
    const expectedScale = component.calculateScaleFactor(distance, maxDistance, minScale, maxScale);
    expect(expectedScale).toBeCloseTo(1.56, 2);
  });

  it('should reset dock item scales when the mouse leaves the dock panel', () => {
    component.dockItems.forEach((item) => (item.scale = 1.5)); // Simulate scaled items
    component.resetDockItemScales();
    component.dockItems.forEach((item) => {
      expect(item.scale).toBe(1);
    });
  });

  it('should handle mouse enter and leave events correctly', () => {
    const mouseEnterEvent = new Event('mouseenter');
    const mouseLeaveEvent = new Event('mouseleave');

    spyOn(component, 'resetDockItemScales').and.callThrough();

    dockPanelDebugElement.triggerEventHandler('mouseenter', mouseEnterEvent);
    expect(component['isMouseOverDock']).toBeTrue();

    dockPanelDebugElement.triggerEventHandler('mouseleave', mouseLeaveEvent);
    expect(component['isMouseOverDock']).toBeFalse();
    expect(component.resetDockItemScales).toHaveBeenCalled();
  });

  it('should calculate correct dock item scales on mouse movement', () => {
    spyOn(component, 'calculateScales').and.callThrough();

    const mockMouseEvent = new MouseEvent('mousemove', { clientX: 100, clientY: 200 });
    window.dispatchEvent(mockMouseEvent);

    expect(component.calculateScales).toHaveBeenCalledWith(100, 200);
  });
});
