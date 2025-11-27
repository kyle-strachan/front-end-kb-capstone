import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import ThemeProviderContext from "./context/ThemeContext";
import { LoadingProvider } from "./context/LoadingContext";

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProviderContext>
          <LoadingProvider>
            <App />
          </LoadingProvider>
        </ThemeProviderContext>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
