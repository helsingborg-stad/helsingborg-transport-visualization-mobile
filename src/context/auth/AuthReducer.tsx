import { Action, ActionType, AuthState } from './AuthTypes';

export const reducer = (state: AuthState, action: Action) => {
  switch (action.type) {
    case ActionType.LOGIN:
      return {
        ...state,
        token: action.payload.token,
        isLoggedIn: action.payload.isLoggedIn,
        id: action.payload.id,
        orgNumber: action.payload.orgNumber,
        pin: action.payload.pin,
        email: action.payload.email,
        name: action.payload.name,
        createdAt: action.payload.createdAt,
        updatedAt: action.payload.updatedAt,
      };
    case ActionType.LOGOUT: {
      return {
        ...state,
        token: null,
        isLoggedIn: action.payload.isLoggedIn,
        id: '',
        orgNumber: '',
        email: '',
        name: '',
        createdAt: '',
        updatedAt: '',
      };
    }
    default: {
      throw new Error(`Unhandled action type - ${JSON.stringify(action)}`);
    }
  }
};
