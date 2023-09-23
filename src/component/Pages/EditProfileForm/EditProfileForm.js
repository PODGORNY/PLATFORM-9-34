import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { edit } from '../../../Reducer/authSlice';
import { updateUserProfile, userDataAPI } from '../../../Service/API';
import './editProfileForm.css';

// компонент редактирования профиля
const EditProfileForm = () => {
  // имя и почта на входе
  const [usernameInput, setUsernameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const history = useHistory();

  // подключение методов формы в форму
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onBlur',
  });

  const email = watch('email');

  // отправка данных формы
  const onSubmit = async (data) => {
    const userData = {
      user: {
        username: data.username,
        email: data.email,
        password: data.password,
        image: data.imageUrl,
      },
    };
    const token = localStorage.getItem('token');

    try {
      const response = await updateUserProfile(userData, token);
      dispatch(edit(response));
      history.push('/');
    } catch (error) {
      setError(error.message);
    }
  };

  // запрос для отображения старых данных пользователя при переходе на редактирование
  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem('token');
      const response = await userDataAPI(token);
      setUsernameInput(response.username);
      setEmailInput(response.email);
    }
    fetchData();
  }, []);

  useEffect(() => {
    // проверяю корректность email и ставлю нужную ошибку
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      setError('Email data is incorrect');
    } else {
      setError('');
    }
  }, [email]);

  return (
    <div className="form-container">
      <h3 className="form-title">Edit Profile</h3>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="label-container">
          <label htmlFor="username">
            <span className="title-input">Username</span>
            <input
              className="input-username"
              value={usernameInput}
              type="text"
              name="username"
              {...register('username', {
                required: 'The field is required ',
              })}
              onChange={(event) => setUsernameInput(event.target.value)}
            />
            {error?.username && <div className="incorrect-data">{error?.username}</div>}
          </label>
        </div>
        <div className="label-container">
          <label htmlFor="email">
            <span className="title-input">Email address</span>
            <input
              value={emailInput}
              type="email"
              name="email"
              {...register('email')}
              onChange={(event) => setEmailInput(event.target.value)}
            />
            {error?.email && <div className="incorrect-data">{error?.email}</div>}
          </label>
        </div>
        <div className="label-container">
          <label htmlFor="password">
            <span className="title-input">Password</span>
            <input
              type="password"
              name="password"
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
            {errors?.password && <div className="incorrect-data">{errors?.password?.message}</div>}
          </label>
        </div>
        <div className="label-container">
          <label htmlFor="imageUrl">
            <span className="title-input">Avatar image (url)</span>
            {/* <Input type="text" name="imageUrl" {...register("imageUrl")} /> */}
            <input
              className="input-username"
              type="text"
              name="imageUrl"
              {...register('imageUrl', {
                required: 'The field is required ',
                pattern: {
                  value: /^(ftp|http|https):\/\/[^ "]+$/,
                  message: 'Enter a valid image link',
                },
              })}
            />
            {errors.imageUrl && <div className="incorrect-data">{errors.imageUrl.message}</div>}
          </label>
        </div>
        <input type="submit" className="submit-btn" value="Create" disabled={!isValid} />
      </form>
    </div>
  );
};

export default EditProfileForm;
