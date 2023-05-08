export enum ActionType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

export type AuthState = {
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
};

type SetToken = {
  type: ActionType.LOGIN;
  payload: { token: string; isLoggedIn: boolean };
};

type Logout = {
  type: ActionType.LOGOUT;
  payload: { isLoggedIn: boolean };
};

export type Action = SetToken | Logout;

export interface AuthContextProps extends AuthState {
  setToken: (token: string) => Promise<void>;
  logout: () => void;
}
