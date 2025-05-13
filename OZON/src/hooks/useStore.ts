// customHooks.ts
import { useDispatch as useReduxDispatch } from 'react-redux';
import { AppDispatch } from '../store';

export const useDispatch = () => useReduxDispatch<AppDispatch>();