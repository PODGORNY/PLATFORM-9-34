import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import { message } from 'antd';
//import { yupResolver } from '@hookform/resolvers/yup';

//import { updateProfile } from '../../Service/loginRegisterAPI';
//import { userUpdate, setLogged, setUser, setErrorState } from '../../Reducer/action';
//import { profileSchema } from '../../YUP/yup';
import styles from '../App/App.module.scss';

export default function Profile() {
  const dispatch = useDispatch();
  const { errorState } = useSelector((state) => state.reduserLogin);
  const { user } = useSelector((state) => state.reduserLogin);
  const history = useHistory();
  const [box, setBox] = useState({
    username: user.username,
    email: user.email,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: 'onBlur', resolver: yupResolver(profileSchema) });

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    console.log(e);
    setBox((prevBox) => ({
      ...prevBox,
      [name]: value,
    }));
  };

  const onSubmit = (data) => {
    const filteredKeys = Object.keys(data).filter((key) => data[key] !== '');
    const newData = filteredKeys.reduce((acc, key) => ({ ...acc, [key]: data[key] }), {});

    const { username, email, password, image } = newData;
    const user = {
      user: {
        username: username,
        email: email,
        password: password,
        image: image,
      },
    };
    dispatch(userUpdate(user));
    if (data.user) {
      dispatch(setUser(data.user));
      dispatch(setErrorState(''));
    }
    if (data.errors) {
      const value = Object.entries(data.errors).map(([key, value]) => `${key}: ${value}`);
      dispatch(setErrorState(value));
    }

    if (errorState === '') {
      message.success('Profile updated succsessfully');
      history.push('/');
      reset();
    }
  };

  return (
    <div className={styles.block__form}>
      <h2>Edit Profile</h2>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          className={styles.input}
          autoFocus
          id="username"
          placeholder="Username"
          defaultValue={box.username}
          onChange={handleChange}
          {...register('username')}
        />
        {errors?.username && <div className={styles.error}>{errors?.username.message || 'Error'}</div>}
        <label htmlFor="email">Email address</label>
        <input
          id="email"
          type="email"
          className={styles.input}
          placeholder="Email address"
          defaultValue={box.email}
          onChange={handleChange}
          {...register('email')}
        />
        {errors?.email && <div className={styles.error}>{errors?.email?.message || 'Error'}</div>}
        <label htmlFor="password">New password</label>
        <input
          id="password"
          type="password"
          className={styles.input}
          placeholder="Password"
          {...register('password')}
        />
        {errors?.password && <div className={styles.error}>{errors?.password?.message || 'Error'}</div>}
        <label htmlFor="image">Avatar image (url)</label>
        <input id="image" type="text" className={styles.input} placeholder="Avatar image" {...register('image')} />
        {errors?.image && <div className={styles.error}>{errors?.image?.message || 'Error'}</div>}
        <input type="submit" name="submit" id="submit" value="Save" />
      </form>
      {errorState && <div className={styles.error}>{errorState}</div>}
    </div>
  );
}
