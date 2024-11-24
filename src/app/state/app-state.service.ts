import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AppState {
  isDragging: boolean;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  private state = new BehaviorSubject<AppState>({
    isDragging: false,
  });

  state$ = this.state.asObservable();

  setState(newState: Partial<AppState>) {
    this.state.next({ ...this.state.getValue(), ...newState });
  }
}
