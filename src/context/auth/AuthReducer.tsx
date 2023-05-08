import { Action, ActionType, AuthState } from './AuthTypes';

export const reducer = (state: AuthState, action: Action) => {
  switch (action.type) {
    case ActionType.LOGIN:
      return {
        ...state,
        token: action.payload.token,
        isLoggedIn: action.payload.isLoggedIn,
      };
    case ActionType.LOGOUT: {
      return {
        ...state,
        token: null,
        isLoggedIn: action.payload.isLoggedIn,
      };
    }
    default: {
      throw new Error(`Unhandled action type - ${JSON.stringify(action)}`);
    }
  }
};
