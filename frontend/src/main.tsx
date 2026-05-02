import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Global Error Trap
window.onerror = function (message, source, lineno, colno, error) {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="color: red; padding: 20px; background: #2a0000; min-height: 100vh; font-family: sans-serif;">
        <h1>Application Crashed 💥</h1>
        <p><strong>Error:</strong> ${message}</p>
        <p><strong>Location:</strong> ${source}:${lineno}:${colno}</p>
        <pre style="background: black; padding: 10px; overflow: auto; border-radius: 5px;">${error?.stack || 'No stack trace'}</pre>
      </div>
    `;
  }
};

try {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const isConfigured = apiKey && apiKey.length > 10 && apiKey !== "your_api_key_here";
  const rootElement = document.getElementById('root');

  if (!rootElement) throw new Error("Root element not found");

  if (!isConfigured) {
    createRoot(rootElement).render(
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8 text-center font-sans">
        <div className="max-w-xl space-y-6">
          <h1 className="text-4xl font-bold text-red-400">Configuration Required ⚠️</h1>
          <p className="text-xl text-gray-300">The application cannot start because it's missing Firebase credentials.</p>
          <div className="bg-gray-800 p-6 rounded-lg text-left border border-gray-700">
            <p>Check frontend/.env.local</p>
          </div>
        </div>
      </div>
    )
  } else {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  }
} catch (e: any) {
  console.error("Top Level Crash:", e);
  document.body.innerHTML = `<div style="color:red; padding:20px;"><h1>Top Level Crash</h1><pre>${e.message}\n${e.stack}</pre></div>`;
}
