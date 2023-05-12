import { useEffect } from 'react';
import { useAuthContext } from '@src/context/auth/AuthState';
import api from '@src/api';
import { useMutation } from '@tanstack/react-query';
type HookParams = {
  onSuccess?: () => void;
  onError?: () => void;
  userPin: string;
};

type LoginRequest = {
  identifier: string;
  pinCode: string;
};

type Hook = (params: HookParams) => {
  isLoading: boolean;
  login: ({ identifier, pinCode }: LoginRequest) => void;
};

export const useLogin: Hook = ({ onSuccess, onError, userPin }) => {
  const { setUser } = useAuthContext();

  const {
    data: user,
    mutate: login,
    isLoading,
  } = useMutation({
    mutationKey: ['login'],
    mutationFn: ({ identifier, pinCode }: LoginRequest) => {
      return api.login({ identifier, pinCode });
    },
    onError: () => {
      onError?.();
    },
  });

  useEffect(() => {
    if (!user) {
      return;
    }
    const extraKeys = { pin: userPin, isLoggedIn: true };
    const userObj = { ...user, ...extraKeys };

    setUser(userObj).then(() => {
      onSuccess?.();
    });
  }, [user]);

  return {
    isLoading,
    login,
  };
};
