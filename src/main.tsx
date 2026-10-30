import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// After a new deployment, a page kept open (or cached) may request build files that
// no longer exist: reload once to get the current version instead of a blank page.
window.addEventListener('vite:preloadError', (event) => {
  const key = 'cicexf_reloaded_after_deploy';
  try {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
  } catch {}
  event.preventDefault();
  window.location.reload();
});
// Once the page has run fine for a while, allow a future reload again (next deployment)
window.setTimeout(() => {
  try { sessionStorage.removeItem('cicexf_reloaded_after_deploy'); } catch {}
}, 15000);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
