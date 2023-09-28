import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import { registerUser } from '../../../Service/platformAPI';
import { setErrors } from '../../../Reducer/slices/user-slice';
import signUp from '../SignUp/SignUp.module.scss';
import { setSubmit } from '../../../Reducer/slices/status-slice';

import styles from './SignIn.module.scss';

function SignIn() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm();

  const servErr = useSelector((state) => state.user.errors);

  const dispatch = useDispatch();

  const onSubmit = (data) => {
    dispatch(setSubmit(false));
    dispatch(registerUser(data, true));
  };

  const navigate = useNavigate();
  const home = useSelector((state) => state.status.home);
  useEffect(() => {
    dispatch(setErrors(null));
    if (home) navigate('/');
  }, [home, dispatch, navigate]);

  const { submitActive } = useSelector((state) => state.status);
  const submit = submitActive ? styles.submit : classNames(styles.submit, styles.disabledBtn);

  return (
    <div className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <h1 className={styles.title}>Sign In</h1>

        <ul className={styles.inputsList}>
          <li className={styles.inputsItem}>
            <label htmlFor="email" className={styles.label}>
              Email address{' '}
            </label>
            <input
              className={styles.input}
              type="email"
              id="email"
              placeholder="Email address"
              autoFocus
              onKeyUp={() => {
                setValue('email', watch('email').toLowerCase());
              }}
              style={errors.email && { outline: '1px solid #F5222D' }}
              {...register('email', {
                required: 'Email address can`t be empty',
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Email address is not correct',
                },
              })}
            />
            {errors.email && <p className={styles.error}>{errors.email.message}</p>}
          </li>
          <li className={styles.inputsItem}>
            <label htmlFor="password" className={styles.label}>
              Password{' '}
            </label>
            <input
              className={styles.input}
              type="password"
              id="password"
              placeholder="Password"
              style={errors.password && { outline: '1px solid #F5222D' }}
              {...register('password', {
                required: 'Password can`t be empty.',
              })}
            />
            {errors.password && <p className={styles.error}>{errors.password.message}</p>}
            {servErr && (
              <p className={signUp.error}>{`${Object.entries(servErr)[0][0]} ${Object.entries(servErr)[0][1]}`}</p>
            )}
          </li>
        </ul>

        <button type="submit" className={submit} disabled={!submitActive}>
          Sign In
        </button>

        <span className={styles.signInLabel}>
          Don`t have an account?
          <Link className={styles.signUp} to="/SignUp">
            Sign Up.
          </Link>
        </span>
      </form>
    </div>
  );
}

export default SignIn;
