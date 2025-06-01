import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { registerServiceWorker } from './services/pushNotificationService';

// Register the service worker for push notifications
// This ensures the service worker is registered even if the user is not logged in
// The actual subscription will happen when the user logs in
if ('serviceWorker' in navigator) {
  registerServiceWorker().catch(error => {
    console.error('Service worker registration failed:', error);
    // Continue even if service worker registration fails
    // The app will try again when the user logs in
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
