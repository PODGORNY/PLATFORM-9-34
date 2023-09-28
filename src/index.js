// фундамент приложения
import React from 'react';
import ReactDOM from 'react-dom/client';
// Provider - даёт легкий доступ к глобальным данным, дальним компонентам
import { Provider } from 'react-redux';

import App from './component/App/App';
// подключу стор - где редуктор и стэйт
import store from './Reducer/store';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

/*
// Router - обёртка для компонентов, чтобы поделить их на части,
// для того чтобы переключаться как по страницам
import { BrowserRouter as Router } from 'react-router-dom';
*/
