
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeAppVersion } from './utils/appVersionManager'

// Initialize app version management
initializeAppVersion();

// Add mobile viewport meta tag if not present
if (!document.querySelector('meta[name="viewport"]')) {
  const meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
  document.getElementsByTagName('head')[0].appendChild(meta);
}

createRoot(document.getElementById("root")!).render(<App />);
