import {
  Component,
  Input,
  ElementRef,
  Renderer2,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MenuStateService } from '../../../state/menu-state.service';
import { NgClass } from '@angular/common';
import { ClickOutsideDirective } from '../../../directives/click-outside.directive';

@Component({
  selector: 'app-menu-item',
  standalone: true,
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
  imports: [ClickOutsideDirective, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuItemComponent implements OnInit, OnDestroy {
  @Input() menuItems: { label: string; action: () => void }[] = [];
  @Input() isAppleMenu = false;

  private unsubscribeCloseMenuListener?: () => void;
  private isMouseInside = false;

  constructor(
    protected readonly el: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
    protected readonly menuStateService: MenuStateService
  ) {}

  ngOnInit(): void {
    this.unsubscribeCloseMenuListener = this.renderer.listen(
      this.el.nativeElement,
      'closeMenu',
      () => this.closeMenu()
    );
  }

  ngOnDestroy(): void {
    this.unsubscribeCloseMenuListener?.();
    this.menuStateService.clearActiveMenu(this.el.nativeElement);
  }

  openMenu(): void {
    this.isMouseInside = true;
    this.menuStateService.setActiveMenu(this.el.nativeElement);
  }

  closeMenu(): void {
    this.isMouseInside = false;
    this.menuStateService.clearActiveMenu(this.el.nativeElement);
  }

  handleMouseMove(event: MouseEvent): void {
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

  private isInsideElement(element: HTMLElement, event: MouseEvent): boolean {
    const rect = element.getBoundingClientRect();
    return (
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom
    );
  }

  onMenuEnter(): void {
    this.openMenu();
  }

  onMenuLeave(event: MouseEvent): void {
    this.handleMouseMove(event);
  }
}
