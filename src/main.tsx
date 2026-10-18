import { createRoot } from 'react-dom/client';
import App from './Root';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <App />,
);
