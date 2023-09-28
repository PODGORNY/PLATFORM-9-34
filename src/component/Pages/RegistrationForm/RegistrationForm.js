import { useState, useEffect } from 'react';
// получение данных из стэйт, отправка данных
import { useDispatch, useSelector } from 'react-redux';
// хук простого создания формы
import { useForm } from 'react-hook-form';
import { Link, Redirect } from 'react-router-dom';

import { login, selectAuth } from '../../../Reducer/authSlice';
import { registerUser } from '../../../Service/articleAPI';
import './registrationForm.css';

// компонент Форма для Регистрации...аналог Логина
const RegistrationForm = () => {
  // ошибка не ошибка
  const [error, setError] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const dispatch = useDispatch();
  // проверка авторизации
  const isAuth = useSelector(selectAuth);

  // подключение внутренних методов формы в форму-------------------------форма
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onBlur',
  });

  const password = watch('password');
  const repeatPassword = watch('repeatPassword');
  const checked = watch('checkbox');

  // ----------------------------------------------------------отправка данных формы
  const onSubmit = async (data) => {
    // введённые данные собираются в userData
    const userData = {
      user: {
        username: data.username,
        email: data.email,
        password: data.password,
      },
    };
    try {
      const response = await registerUser(userData);
      dispatch(login(response));
    } catch (error) {
      setError(error);
    }
  };

  // сравниваю значения полей password и repeatPassword и ставлю нужную ошибку
  useEffect(() => {
    if (password !== repeatPassword && repeatPassword.length !== 0) {
      setErrorPassword('Пароли не совпадают');
    } else {
      setErrorPassword('');
    }
  }, [password, repeatPassword]);

  if (isAuth) {
    return <Redirect to="/" />;
  }

  return (
    <div className="form-container">
      <h3 className="form-title">Create new account</h3>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="label-container">
          <label htmlFor="username">
            <span className="title-input">Username</span>
            <input
              className="input-username"
              type="text"
              name="username"
              placeholder="username"
              {...register('username', {
                required: true,
                minLength: {
                  value: 6,
                  message: 'Short name',
                },
                maxLength: {
                  value: 40,
                  message: 'Long name',
                },
              })}
            />
            {error?.username && <span className="incorrect-data">{error?.username}</span>}
            {Object.keys(errors).map((key) => (
              <div className="error" key={key}>
                {errors[key].message}
              </div>
            ))}
          </label>
        </div>
        <div className="label-container">
          <label htmlFor="email">
            <span className="title-input">Email address</span>
            <input className="input-email" type="email" name="email" placeholder="email" {...register('email')} />
            {error && <span className="incorrect-data">{error?.email}</span>}
          </label>
        </div>
        <div className="label-container">
          <label htmlFor="password">
            <span className="title-input">Password</span>
            <input
              type="password"
              name="password"
              className="input-password"
              placeholder="password"
              {...register('password', {
                required: 'The field is required ',
                minLength: {
                  value: 6,
                  message: 'Too short password',
                },
                maxLength: {
                  value: 40,
                  message: 'Too long password',
                },
              })}
            />
            {errors?.password && <span className="incorrect-data">{errors?.password?.message}</span>}
          </label>
        </div>
        <div className="label-container">
          <label htmlFor="repeatPassword">
            <span className="title-input">Repeat Password</span>
            <input
              type="password"
              className="input-password-rep"
              name="repeatPassword"
              placeholder="repeat password"
              {...register('repeatPassword')}
            />
          </label>
        </div>
        {errorPassword && <span className="incorrect-data">{errorPassword}</span>}
        <div className="check-container">
          <label className="label">
            <input className="checkbox" type="checkbox" name="checkbox" {...register('checkbox')} />
            <span className="title-input">I agree to the processing of my personal information</span>
          </label>
        </div>
        {checked ? null : <span className="incorrect-data">You have to accept an agreement</span>}
        <input type="submit" className="submit-btn" value="Create" disabled={!isValid} />
      </form>
      <p className="footer">
        Already have an account? <Link to={'/sign-in'}>Sign In</Link>.
      </p>
    </div>
  );
};

export default RegistrationForm;
