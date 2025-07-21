import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // ✅ IMPORTANT
import './index.css';        // optional but should exist

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
