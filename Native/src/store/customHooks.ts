// customHooks.ts
import { useDispatch as useReduxDispatch } from 'react-redux';
import { AppDispatch } from './index';

export const useDispatch = () => useReduxDispatch<AppDispatch>();