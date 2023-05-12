// Auth
export type LoginRequest = {
  identifier: string;
  pincode: string;
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
