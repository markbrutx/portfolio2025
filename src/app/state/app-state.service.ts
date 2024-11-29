import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AppState {
  isDragging: boolean;
  maximizedWindowId: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  private state = new BehaviorSubject<AppState>({
    isDragging: false,
    maximizedWindowId: null,
  });

  state$ = this.state.asObservable();

  setState(newState: Partial<AppState>) {
    this.state.next({ ...this.state.getValue(), ...newState });
  }
}
