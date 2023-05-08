import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import * as SecureStore from 'expo-secure-store';
import { reducer } from './AuthReducer';
import { ActionType, AuthContextProps } from './AuthTypes';

export const AuthStore = () => {
  const initialState = {
    token: null,
    isLoggedIn: false,
    isLoading: true,
  };

  const [isLoading, setIsLoading] = useState(true);

  const [state, dispatch] = useReducer(reducer, initialState);

  const getTokenFromStore = async () => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      dispatch({
        type: ActionType.LOGIN,
        payload: { token, isLoggedIn: true },
      });
    }
  };

  useEffect(() => {
    const getDataFromStore = async () => {
      try {
        setIsLoading(true);
        await getTokenFromStore();
      } catch {
        throw new Error('Error getting data from store');
      } finally {
        setIsLoading(false);
      }
    };

    getDataFromStore();
  }, []);

  const setToken = async (token: string) => {
    try {
      setIsLoading(true);
      await SecureStore.setItemAsync('token', token);
      dispatch({
        type: ActionType.LOGIN,
        payload: { token, isLoggedIn: true },
      });
    } catch {
      throw new Error('setUser failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await SecureStore.deleteItemAsync('token');
      dispatch({ type: ActionType.LOGOUT, payload: { isLoggedIn: false } });
    } catch {
      throw new Error('logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    token: state.token,
    isLoggedIn: state.isLoggedIn,
    isLoading,
    setToken,
    logout,
  };
};

export const AuthContext = createContext<AuthContextProps | null>(null);

export const useAuthContext = () => {
  const store = useContext(AuthContext);

  if (!store) {
    throw new Error('Cannot use `useAuthContext` outside of a AuthProvider');
  }

  return store;
};

type AuthProviderProps = {
  children?: React.ReactNode;
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return (
    <AuthContext.Provider value={AuthStore()}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
