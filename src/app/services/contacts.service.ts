import { Injectable } from '@angular/core';

export interface Contact {
  id: string;
  icon: string;
  label: string;
  value: string;
  link: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  private contacts: Contact[] = [
    {
      id: 'email',
      icon: 'assets/icons/envelope.svg',
      label: 'Email',
      value: 'quintbrut@gmail.com',
      link: 'mailto:quintbrut@gmail.com'
    },
    {
      id: 'whatsapp',
      icon: 'assets/icons/whatsapp-logo.svg',
      label: 'WhatsApp',
      value: '+44 7441 423837',
      link: 'https://wa.me/447441423837'
    },
    {
      id: 'telegram',
      icon: 'assets/icons/telegram-logo.svg',
      label: 'Telegram',
      value: '@quintbrut',
      link: 'https://t.me/quintbrut'
    },
 
    {
      id: 'instagram',
      icon: 'assets/icons/instagram-logo.svg',
      label: 'Instagram',
      value: '@quintbrut',
      link: 'https://instagram.com/quintbrut'
    },
    {
      id: 'linkedin',
      icon: 'assets/icons/linkedin-logo.svg',
      label: 'LinkedIn',
      value: 'quintbrut',
      link: 'https://linkedin.com/in/quintbrut'
    },
    {
      id: 'phone',
      icon: 'assets/icons/phone.svg',
      label: 'Phone',
      value: '+44 7441 423837',
      link: 'tel:+447441423837'
    }
  ];

  getContacts(): Contact[] {
    return this.contacts;
  }
}
