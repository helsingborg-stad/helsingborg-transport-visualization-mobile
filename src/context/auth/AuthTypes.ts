export enum ActionType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

export type User = {
  trackingId: string;
  token: string | null;
  id: string;
  orgNumber: string;
  email: string;
  name: string;
  pin: string;
  isLoggedIn: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AuthState = {
  trackingId: string;
  token: string | null;
  id: string;
  orgNumber: string;
  pin: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  isLoggedIn: boolean;
  isLoading: boolean;
};

type SetUser = {
  type: ActionType.LOGIN;
  payload: {
    trackingId: string;
    token: string | null;
    id: string;
    orgNumber: string;
    pin: string;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    isLoggedIn: boolean;
  };
};

type Logout = {
  type: ActionType.LOGOUT;
  payload: { isLoggedIn: boolean };
};

export type Action = SetUser | Logout;

export interface AuthContextProps extends Partial<AuthState> {
  setUser: (user: User) => Promise<void>;
  logout: () => void;
}
