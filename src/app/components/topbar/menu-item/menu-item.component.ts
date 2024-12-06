import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { MenuStateService } from '../../../state/menu-state.service';
import { NgClass } from '@angular/common';
import { ClickOutsideDirective } from '../../../directives/click-outside.directive';

interface MenuItem {
  label: string;
  action: () => void;
}

@Component({
  selector: 'app-menu-item',
  standalone: true,
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
  imports: [ClickOutsideDirective, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuItemComponent {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly menuStateService = inject(MenuStateService);
  private readonly isMouseInside = signal(false);

  readonly menuItems = input<MenuItem[]>([]);
  readonly isAppleMenu = input(false);
  readonly isMenuOpen = computed(() => this.isMouseInside());
  readonly itemClick = output<MenuItem>();

  protected closeMenu(): void {
    this.isMouseInside.set(false);
    this.menuStateService.clearActiveMenu(this.el.nativeElement);
  }

  protected openMenu(): void {
    this.isMouseInside.set(true);
    this.menuStateService.setActiveMenu(this.el.nativeElement);
  }

  protected handleMouseMove(event: MouseEvent): void {
    const element = this.el.nativeElement;
    const dropdown = element.querySelector('.dropdown') as HTMLElement;
    const button = element.querySelector('button') as HTMLElement;

    if (!dropdown || !button) {
      return;
    }

    const insideButton = this.isInsideElement(button, event);
    const insideDropdown = this.isInsideElement(dropdown, event);

    if (!insideButton && !insideDropdown) {
      this.closeMenu();
    }
  }

  protected onMenuEnter(): void {
    this.openMenu();
  }

  protected onMenuLeave(event: MouseEvent): void {
    this.handleMouseMove(event);
  }

  handleItemClick(event: Event, item: MenuItem): void {
    event.stopPropagation();
    this.itemClick.emit({ ...item });
    this.closeMenu();
  }

  private isInsideElement(element: HTMLElement, event: MouseEvent): boolean {
    const rect = element.getBoundingClientRect();
    return (
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom
    );
  }
}
