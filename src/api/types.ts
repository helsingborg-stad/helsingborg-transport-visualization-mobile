// Auth
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
