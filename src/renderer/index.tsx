import { createRoot } from 'react-dom/client';
import RouterProvider from './providers/RouterProvider';

import './App.css';

createRoot(document.getElementById('root')!).render(<RouterProvider />);
