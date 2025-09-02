import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UnitsList from './components/UnitsList';
import './App.css';

// Create a client untuk React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <UnitsList />
      </div>
    </QueryClientProvider>
  );
}

export default App;
