import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import jwt_decode from 'jwt-decode';
import * as SecureStore from 'expo-secure-store';
import { reducer } from './AuthReducer';
import { ActionType, AuthContextProps, User } from './AuthTypes';

export const AuthStore = () => {
  const initialState = {
    trackingId: '',
    token: '',
    id: '',
    orgNumber: '',
    pin: '',
    email: '',
    name: '',
    createdAt: '',
    updatedAt: '',
    isLoggedIn: false,
    isTokenExpired: true,
    isLoading: true,
  };

  const [isLoading, setIsLoading] = useState(true);

  const [state, dispatch] = useReducer(reducer, initialState);

  const getTokenFromStore = async () => {
    const userStr = await SecureStore.getItemAsync('user');
    const user: User = JSON.parse(userStr);

    if (user) {
      //check if user's token is still valid.
      const decoded: any = jwt_decode(user?.token);
      const tokenStatus = Math.floor(Date.now() / 1000) > decoded.exp;
      console.log('--> is token expired: ', tokenStatus);

      dispatch({
        type: ActionType.LOGIN,
        payload: {
          trackingId: user.trackingId,
          token: user.token,
          isLoggedIn: user.isLoggedIn,
          isTokenExpired: tokenStatus,
          id: user.id,
          orgNumber: user.orgNumber,
          pin: user.pin,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
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

  const setUser = async (user: User) => {
    try {
      setIsLoading(true);
      await SecureStore.setItemAsync('user', JSON.stringify(user));
      dispatch({
        type: ActionType.LOGIN,
        payload: {
          trackingId: '',
          token: user.token,
          isLoggedIn: user.isLoggedIn,
          isTokenExpired: user.isTokenExpired,
          id: user.id,
          orgNumber: user.orgNumber,
          pin: user.pin,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } catch {
      throw new Error('setUser failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    console.log('Logged out');
    try {
      setIsLoading(true);
      // await SecureStore.deleteItemAsync('user');
      const userStr = await SecureStore.getItemAsync('user');
      const userObj = JSON.parse(userStr);
      const updatedUser = {
        ...userObj,
        isLoggedIn: false,
        isTokenExpired: true,
      };
      await SecureStore.setItemAsync('user', JSON.stringify(updatedUser));

      dispatch({
        type: ActionType.LOGOUT,
        payload: { isLoggedIn: false, isTokenExpired: true },
      });
    } catch {
      throw new Error('logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user: {
      token: state.token,
      orgNumber: state.orgNumber,
      pin: state.pin,
    },
    isLoggedIn: state.isLoggedIn,
    isTokenExpired: state.isTokenExpired,
    isLoading,
    setUser,
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
