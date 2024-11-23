import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TrafficLightsComponent } from './traffic-lights.component'

describe('TrafficLightsComponent', () => {
  let component: TrafficLightsComponent
  let fixture: ComponentFixture<TrafficLightsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrafficLightsComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(TrafficLightsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
