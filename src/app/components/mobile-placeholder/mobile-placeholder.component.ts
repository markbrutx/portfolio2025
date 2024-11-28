import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsService, Contact } from '../../services/contacts.service';

@Component({
  selector: 'app-mobile-placeholder',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mobile-placeholder.component.html',
  styleUrls: ['./mobile-placeholder.component.scss']
})
export class MobilePlaceholderComponent {
  showContacts = signal<boolean>(false);
  contacts: Contact[];

  constructor(private contactsService: ContactsService) {
    this.contacts = this.contactsService.getContacts();
  }

  toggleContacts(): void {
    this.showContacts.update(value => !value);
  }
}
