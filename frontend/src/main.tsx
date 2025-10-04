import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './redux/store/store';
import { GoogleOAuthProvider } from "@react-oauth/google";




const rootElement = document.getElementById('root')!;
const root = createRoot(rootElement);

root.render(
  <BrowserRouter basename='https://ayushmaangupta261.github.io/Cloud-Page/'>
    <Provider store={store}>
    
        <App />
      
    </Provider>
  </BrowserRouter>
);
