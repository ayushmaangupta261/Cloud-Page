import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './redux/store/store';




// Only the subpath for GitHub Pages
const basename = '/Cloud-Page/';

const rootElement = document.getElementById('root')!;
const root = createRoot(rootElement);

root.render(
  <BrowserRouter basename={basename}>
    <Provider store={store}>
    
        <App />
      
    </Provider>
  </BrowserRouter>
);
