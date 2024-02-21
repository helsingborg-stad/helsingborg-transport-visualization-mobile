// Auth
import { ZoneFeature } from '@src/modules/home/types';

export type LoginRequest = {
  identifier: string;
  pinCode: string;
};

export type LoginResponse = {
  id: string;
  orgNumber: string;
  email: string;
  name: string;
  token: string;
  createdAt: string;
  updatedAt: string;
};

export type OrganisationResponse = {
  contactPerson: string;
  createdAt: string;
  email: string;
  id: string;
  mobileNumber: string;
  name: string;
  orgNumber: string;
  updatedAt: string;
};

export type EventRequestType = {
  trackingId: string;
  sessionId: string;
  deviceId: string;
  distributionZoneId: string;
  enteredAt: string;
  exitedAt: string;
};

export type TrackingEvent = {
  trackingId: string;
  sessionId: string;
  deviceId: string;
  distributionZoneId?: string;
  zone: ZoneFeature;
  enteredAt: string;
  exitedAt: string;
};
