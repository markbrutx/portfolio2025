import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsService, Contact } from '../../../services/contacts.service';
import { AnalyticsService } from '../../../services/analytics.service';
import { AnalyticsEvent } from '../../../constants/analytics.constants';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent {
  protected readonly copiedField = signal<string>('');
  protected readonly contacts: Contact[];
  
  private readonly contactsService = inject(ContactsService);
  private readonly analyticsService = inject(AnalyticsService);

  constructor() {
    this.contacts = this.contactsService.getContacts();
  }

  handleCopy(text: string, id: string): void {
    navigator.clipboard.writeText(text);
    this.copiedField.set(id);
    this.analyticsService.trackUserInteraction(AnalyticsEvent.CONTACT_COPIED, { field: id });
    setTimeout(() => this.copiedField.set(''), 2000);
  }
}
