export enum NotificationType {
  VIEW_PROFILE = 'VIEW_PROFILE',
  SCAN_PROFILE = 'SCAN_PROFILE',
  SECURE_SCAN = 'SECURE_SCAN',
  ADD_CONTACT = 'ADD_CONTACT',
  APPROVE_CONTACT = 'APPROVE_CONTACT',
}

export interface AddContactPayload {
  connectionSlug: string;
}

export interface ViewProfilePayload {
  ip: string;
}

export type NotificationPayload = AddContactPayload | ViewProfilePayload;
