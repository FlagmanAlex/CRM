import React  from 'react';
import { Navigate } from './src/components/Navigate';
import { ContextProvider } from './src/ContextProvider';

export default function App() {
  return (
    <ContextProvider>
      <Navigate />
    </ContextProvider>
  ) 
}
