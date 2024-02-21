export enum ActionType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

export type User = {
  deviceId: string;
  sessionId: string;
  token: string | null;
  id: string;
  orgNumber: string;
  email: string;
  name: string;
  pin: string;
  isLoggedIn: boolean;
  isTokenExpired: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AuthState = {
  deviceId: string;
  sessionId: string;
  token: string | null;
  id: string;
  orgNumber: string;
  pin: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  isLoggedIn: boolean;
  isTokenExpired: boolean;
  isLoading: boolean;
};

type SetUser = {
  type: ActionType.LOGIN;
  payload: {
    deviceId: string;
    sessionId: string;
    token: string | null;
    id: string;
    orgNumber: string;
    pin: string;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    isLoggedIn: boolean;
    isTokenExpired: boolean;
  };
};

type Logout = {
  type: ActionType.LOGOUT;
  payload: { isLoggedIn: boolean; isTokenExpired: boolean };
};

export type Action = SetUser | Logout;

export interface AuthContextProps extends Partial<AuthState> {
  setUser: (user: User) => Promise<void>;
  logout: () => void;
}
