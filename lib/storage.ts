'use client';

import { Contact, Interaction } from '@/types';
import { mockContacts } from './mockData';

const STORAGE_KEY = 'crm_contacts';

export function getContacts(): Contact[] {
  if (typeof window === 'undefined') return mockContacts;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : mockContacts;
  } catch {
    return mockContacts;
  }
}

export function saveContacts(contacts: Contact[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
}

export function getContactById(id: string): Contact | undefined {
  return getContacts().find((c) => c.id === id);
}

export function addInteraction(contactId: string, interaction: Omit<Interaction, 'id'>): Contact[] {
  const contacts = getContacts();
  const updated = contacts.map((c) => {
    if (c.id !== contactId) return c;
    return {
      ...c,
      interactions: [
        ...c.interactions,
        { ...interaction, id: `i${Date.now()}` },
      ],
    };
  });
  saveContacts(updated);
  return updated;
}

export function updateContactStage(contactId: string, stage: Contact['stage']): Contact[] {
  const contacts = getContacts();
  const updated = contacts.map((c) =>
    c.id === contactId ? { ...c, stage } : c
  );
  saveContacts(updated);
  return updated;
}

export function updateContactStatus(contactId: string, status: Contact['status']): Contact[] {
  const contacts = getContacts();
  const updated = contacts.map((c) =>
    c.id === contactId ? { ...c, status } : c
  );
  saveContacts(updated);
  return updated;
}
