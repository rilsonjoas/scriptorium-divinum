import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initUmami } from './lib/umami'
import './i18n'

// Auto-reload transparente quando um chunk falha após um novo deploy
window.addEventListener('vite:preloadError', () => {
  window.location.reload();
});

initUmami()

createRoot(document.getElementById("root")!).render(<App />);
