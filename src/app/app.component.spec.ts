import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { DockPanelComponent } from './components/dock-panel/dock-panel.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, DockPanelComponent],
      declarations: [AppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create the AppComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct title', () => {
    expect(component.title).toEqual('M.N Portfolio 2025');
  });

  it('should render the desktop container with the correct class', () => {
    const desktopElement = compiled.querySelector('.desktop');
    expect(desktopElement).toBeTruthy();
    expect(window.getComputedStyle(desktopElement!).width).toBe('100%');
    expect(window.getComputedStyle(desktopElement!).height).toBe('100vh');
    expect(window.getComputedStyle(desktopElement!).backgroundImage).toContain('/assets/backgrounds/macos-bg.jpg');
  });

  it('should include a <router-outlet> in the template', () => {
    const routerOutlet = compiled.querySelector('router-outlet');
    expect(routerOutlet).toBeTruthy();
  });

  it('should include the DockPanelComponent in the template', () => {
    const dockPanel = compiled.querySelector('app-dock-panel');
    expect(dockPanel).toBeTruthy();
  });

  it('should apply the global body styles correctly', () => {
    const bodyStyles = window.getComputedStyle(document.body);
    expect(bodyStyles.fontFamily).toContain('Helvetica Neue');
    expect(bodyStyles.margin).toBe('0px');
    expect(bodyStyles.padding).toBe('0px');
  });
});
