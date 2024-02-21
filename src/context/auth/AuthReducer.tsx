import { Action, ActionType, AuthState } from './AuthTypes';

export const reducer = (state: AuthState, action: Action) => {
  switch (action.type) {
    case ActionType.LOGIN:
      return {
        ...state,
        deviceId: action.payload.deviceId,
        sessionId: action.payload.sessionId,
        token: action.payload.token,
        isLoggedIn: action.payload.isLoggedIn,
        isTokenExpired: action.payload.isTokenExpired,
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
        isTokenExpired: action.payload.isTokenExpired,
      };
    }
    default: {
      throw new Error(`Unhandled action type - ${JSON.stringify(action)}`);
    }
  }
};
