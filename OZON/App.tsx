import React  from 'react';
import { Navigate } from './src/components/Navigate';
import { Provider } from 'react-redux';
import { store } from './src/store';

export default function App() {
  return (
    <Provider store={store}>
        <Navigate />
    </Provider>
  ) 
}
