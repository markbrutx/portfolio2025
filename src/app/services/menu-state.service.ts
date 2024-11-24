import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MenuStateService {
  private activeMenu: HTMLElement | null = null;

  setActiveMenu(menu: HTMLElement): void {
    if (this.activeMenu && this.activeMenu !== menu) {
      this.dispatchCloseEvent(this.activeMenu);
    }
    this.activeMenu = menu;
  }

  clearActiveMenu(menu: HTMLElement): void {
    if (this.activeMenu === menu) {
      this.activeMenu = null;
    }
  }

  isMenuActive(menu: HTMLElement): boolean {
    return this.activeMenu === menu;
  }

  private dispatchCloseEvent(menu: HTMLElement): void {
    menu.dispatchEvent(new Event('closeMenu'));
  }
}
