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
