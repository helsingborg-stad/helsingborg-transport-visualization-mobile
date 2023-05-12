import { useEffect, useState } from 'react';
import { useAuthContext } from '@src/context/auth/AuthState';
// import { useMutation } from 'react-query';

type HookParams = {
  onSuccess?: () => void;
  onError?: () => void;
};

type LoginRequest = {
  indentifier: string;
  pinCode: string;
};

type Hook = (params: HookParams) => {
  isLoading: boolean;
  login: ({ indentifier, pinCode }: LoginRequest) => void;
};

export const useLogin: Hook = ({ onSuccess, onError }) => {
  const { setUser } = useAuthContext();
  const user = {
    token: '',
    isLoggedIn: true,
    id: '1',
    orgNumber: '11',
    pin: '123123',
    email: '123123',
    name: '123123',
    createdAt: '',
    updatedAt: '',
  };

  const [isLoading, setIsLoading] = useState(true);

  const login = () => {
    setUser(user).then(() => {
      onSuccess?.();
      onError?.();
    });
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return {
    isLoading,
    login,
  };
};
