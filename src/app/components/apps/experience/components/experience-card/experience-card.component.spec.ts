import { ComponentFixture, TestBed } from '@angular/core/testing';
import ExperienceCardComponent from './experience-card.component'


describe('ExperienceCardComponent', () => {
  let component: ExperienceCardComponent;
  let fixture: ComponentFixture<ExperienceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperienceCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperienceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
