import { useState, useEffect } from 'react';
// хук для удобного создания форм
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { authAPI, selectAuth } from '../../../Reducer/authSlice';
import './loginForm.css';

// компонент Форма для Логина
const LoginForm = () => {
  // ошибка не ошибка
  const [error, setError] = useState('');
  const [errorPass, setErrorPass] = useState('');
  const dispatch = useDispatch();
  // выполнение авторизации
  const isAuth = useSelector(selectAuth);

  // подключаю внутренние методы в формы---------------------------------------------------форма
  const {
    register, // проверяет введёное значение и передаёт и передаёт в функцию отправки
    handleSubmit, // соберёт все введёные данные и отправит в data в onSubmit
    reset,
    watch, // показывает введенные данные
    formState: { isValid }, // отключает форму после отправки, до следующей проверки
  } = useForm({
    mode: 'onBlur', // проверяет когда кликнул вне формы
  });

  const email = watch('email');

  // отправляю данные в форме
  const onSubmit = (data) => {
    const userData = {
      user: {
        email: data.email,
        password: data.password,
      },
    };
    dispatch(authAPI(userData)).then((result) => {
      if (!result.payload) {
        setErrorPass('Incorrect password');
      }
    });
  };

  // проверка корректности email и установка нужной ошибки
  useEffect(() => {
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      setError('Email data is incorrect');
    } else {
      setError('');
    }
  }, [email]);

  if (isAuth) {
    return <Redirect to="/" />;
  }

  return (
    <div className="form-container">
      <h3 className="form-title">Sign In</h3>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="label-container">
          <label htmlFor="email">
            <span className="title-input">Email address</span>
            <input type="email" name="email" placeholder="Email address" {...register('email')} />
            {error && <span className="incorrect-data">{error}</span>}
          </label>
        </div>
        <div className="label-container">
          <label htmlFor="password">
            <span className="title-input">Password</span>
            <input
              className="pass-input"
              placeholder="Password"
              type="password"
              name="password"
              {...register('password', {
                required: true,
              })}
            />
            {errorPass && <span className="incorrect-data">{errorPass}</span>}
          </label>
        </div>

        <input className="submit-button" type="submit" value="Login" disabled={!isValid} />
        <p className="footer_log">
          Don’t have an account? <Link to={'/sign-up'}>Sign Up</Link>.
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
