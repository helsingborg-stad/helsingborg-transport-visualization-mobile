import api from '@src/api';
import { useQuery } from '@tanstack/react-query';

type HookParams = {
  onError?: () => void;
};

type Hook = (params: HookParams) => {
  isLoading: boolean;
  isError: boolean;
  organisationsList: any;
};

export const useGetOrganisations: Hook = ({ onError }) => {
  const {
    isLoading,
    isError,
    data: organisationsList,
  } = useQuery({
    queryKey: ['getOrganisations'],
    queryFn: () => api.getOrganisations(),
  });

  if (isError) onError?.();

  return {
    isLoading,
    isError,
    organisationsList,
  };
};
