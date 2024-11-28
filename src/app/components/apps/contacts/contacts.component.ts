import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsService, Contact } from '../../../services/contacts.service';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent {
  copiedField = signal<string>('');
  contacts: Contact[];

  constructor(private contactsService: ContactsService) {
    this.contacts = this.contactsService.getContacts();
  }

  handleCopy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    this.copiedField.set(id);
    setTimeout(() => this.copiedField.set(''), 2000);
  }
}
