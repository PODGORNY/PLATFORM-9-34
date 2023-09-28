// фундамент приложения
import React from 'react';
import ReactDOM from 'react-dom/client';
// Provider - даёт легкий доступ к глобальным данным, дальним компонентам
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './component/App/App';
// подключу стор - где редуктор и стэйт
import store from './Reducer/store';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
