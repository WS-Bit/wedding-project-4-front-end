import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

function Root() {
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.theme = 'light';
  }, []);

  return (
    <StrictMode>
      <div className="h-full">
        <App />
      </div>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(<Root />);