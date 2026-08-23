import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initUmami } from './lib/umami'
import './i18n'

initUmami()

createRoot(document.getElementById("root")!).render(<App />);
