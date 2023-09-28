import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { message } from 'antd';
//import { yupResolver } from '@hookform/resolvers/yup';
//import { registerUser } from 'store/action';

import { signUp } from '../../Service/loginRegisterAPI';
//import { signUpSchema } from '../../YUP/yup';
import styles from '../App/App.module.scss';

export default function SignUp() {
  const dispatch = useDispatch();
  const reduserLogin = useSelector((state) => state.reduserLogin);
  const { loading, errorState, user, server } = reduserLogin;
  const { token } = user;
  const [ckeckbox, setCheckbox] = useState(false);
  const history = useHistory();
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({ mode: 'onBlur', resolver: yupResolver(signUpSchema) });

  const onSubmit = (dataUser) => {
    // dispatch(signUp(data));
    const { username, email, password } = dataUser;
    const user = {
      user: {
        username: username,
        email: email,
        password: password,
      },
    };
    dispatch(registerUser(user));
  };
  useEffect(() => {
    if (token) {
      message.success('Account created succsessfully');
      history.push('/sign-in');
    }
  }, [token]);

  return (
    <div className={styles.block__form}>
      <h2>Create new account</h2>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <label htmlFor="username">Username</label>
        <input
          {...register('username', {
            required: 'The field must be filled in',
            minLength: {
              value: 3,
              message: 'Your login must have at least 3 characters',
            },
            maxLength: {
              value: 20,
              message: 'Your username must have no more than 20 characters',
            },
          })}
          type="text"
          className={styles.input}
          autoFocus
          id="username"
          placeholder="Username"
        />
        {errors?.username && (
          <div className={styles.error}>{errors?.username.message || 'The field must be filled in'}</div>
        )}

        <label htmlFor="email">Email address</label>
        <input
          {...register('email', {
            required: 'This field is required',
            pattern: {
              value: /^([A-Za-z0-9_.-])+@([A-Za-z0-9_.-])+.([A-Za-z])$/,
              message: 'Incorrect mail',
            },
          })}
          id="email"
          type="email"
          className={styles.input}
          placeholder="Email address"
        />
        {errors?.email && <div className={styles.error}>{errors?.email?.message || 'The field must be filled in'}</div>}

        <label htmlFor="password">Password</label>
        <input
          {...register('password', {
            required: 'The field must be filled in',
            minLength: {
              value: 6,
              message: 'Your password must have at least 3 characters',
            },
            maxLength: {
              value: 40,
              message: 'Your password must have no more than 20 characters',
            },
          })}
          id="password"
          type="password"
          className={styles.input}
          placeholder="Password"
        />
        {errors?.password && (
          <div className={styles.error}>{errors?.password?.message || 'The field must be filled in'}</div>
        )}

        <label htmlFor="repassword">Repeat Password</label>
        <input
          {...register('repassword', {
            required: 'This field is required',
            validate: (val) => {
              if (watch('password') != val) {
                return 'Your passwords do not match';
              }
            },
          })}
          id="repassword"
          type="password"
          className={styles.input}
          placeholder="Password"
        />
        {errors?.repassword && <div className={styles.error}>{errors?.repassword?.message || 'Error'}</div>}

        <label htmlFor="agree">
          <input
            id="agree"
            type="checkbox"
            className={styles.checkbox}
            {...register('agree', { value: ckeckbox, required: 'The field must be filled in' })}
            onChange={(e) => {
              setCheckbox(e.target.checked);
            }}
          />
          {'I agree to the processing of my personal information'}
        </label>
        {errors?.agree && (
          <div className={styles.error}>
            {errors?.check?.message || 'Provide consent to the processing of personal data'}
          </div>
        )}
        <input type="submit" name="submit" id="submit" value="Create" />
      </form>
      <p>
        Already have an account? <Link to="/sign-in">Sign In</Link>.
      </p>
      {errorState && <div className={styles.error}>{errorState}</div>}
    </div>
  );
}
