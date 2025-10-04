import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom'; // <-- HashRouter import
import "./index.css"
import App from './App';
import { Provider } from 'react-redux';
import { store } from './redux/store/store';

const rootElement = document.getElementById('root')!;
const root = createRoot(rootElement);

root.render(
  <HashRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </HashRouter>
);
