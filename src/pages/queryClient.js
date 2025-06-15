// src/queryClient.js
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
          refetchOnWindowFocus: false, // Optional: disable refetching on window focus
          retry: 1, // Optional: limit retry attempts
        }
    }
});