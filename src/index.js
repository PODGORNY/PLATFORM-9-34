// типа сервис - здесь подключены все части Реакт и Редуктора
// для работы приложения
import React from 'react';
import ReactDOM from 'react-dom/client';
// Router - обёртка для компонентов, чтобы поделить их на части,
// для того чтобы переключаться как по страницам
import { BrowserRouter as Router } from 'react-router-dom';
// Provider - даёт легкий доступ к глобальным данным, дальним компонентам
import { Provider } from 'react-redux';

// подключу стор - где редуктор с логикой и общий стэйт
import store from './Reducer/store';
// авторизация сервиса
import { initAuth } from './Reducer/authSlice';
import App from './component/App/App';
import './index.css';

store.dispatch(initAuth()).then(() => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  );
});
