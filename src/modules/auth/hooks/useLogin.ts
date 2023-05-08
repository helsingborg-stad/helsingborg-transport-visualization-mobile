import { useEffect, useState } from 'react';
import { useAuthContext } from '@src/context/auth/AuthState';

type HookParams = {
  onSuccess?: () => void;
  onError?: () => void;
};

type LoginRequest = {
  email: string;
  password: string;
};

type Hook = (params: HookParams) => {
  isLoading: boolean;
  login: ({ email, password }: LoginRequest) => void;
};

export const useLogin: Hook = ({ onSuccess, onError }) => {
  const { setToken } = useAuthContext();
  const tmpToken = 'token';

  const [isLoading, setIsLoading] = useState(true);

  const login = () => {
    setToken(tmpToken).then(() => {
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
