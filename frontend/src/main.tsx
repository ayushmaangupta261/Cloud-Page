import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './redux/store/store';
import { GoogleOAuthProvider } from "@react-oauth/google";


const clientId = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID!;

const rootElement = document.getElementById('root')!;
const root = createRoot(rootElement);

root.render(
  <BrowserRouter >
    <Provider store={store}>
      <GoogleOAuthProvider clientId={clientId}>
        <App />
      </GoogleOAuthProvider>
    </Provider>
  </BrowserRouter>
);
