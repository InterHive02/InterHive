import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  const queryClient = React.useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            refetchOnMount: true,
            refetchOnReconnect: true,
          },
          mutations: {
            retry: 1,
            onError: (error: any) => {
              const message = error?.response?.data?.message || 'An error occurred';
              toast.error(message);
            },
          },
        },
        queryCache: new QueryCache({
          onError: (error: any, query) => {
            if (query?.meta?.errorMessage) {
              toast.error(query.meta.errorMessage as string);
            }
          },
        }),
        mutationCache: new MutationCache({
          onError: (error: any) => {
            const message = error?.response?.data?.message || 'An error occurred';
            toast.error(message);
          },
        }),
      }),
    []
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
