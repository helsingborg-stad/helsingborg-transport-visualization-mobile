import { useEffect } from 'react';

export function useDelegateErrorToRender(error: any) {
  useEffect(() => {
    if (error) {
      throw new Error(error);
    }
  }, [error]);
}
