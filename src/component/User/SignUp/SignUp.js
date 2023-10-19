import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import classNames from 'classnames';

import { registerUser } from '../../../Service/platformAPI';
import { setErrors } from '../../../Reducer/slices/user-slice';
import { setSubmit } from '../../../Reducer/slices/status-slice';

import styles from './SignUp.module.scss';

function SignUp() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    setValue,
    watch,
  } = useForm();

  const dispatch = useDispatch();

  const servErr = useSelector((state) => state.user.errors);
  const { user } = useSelector((state) => state.user);

  const onSubmit = (data) => {
    dispatch(setSubmit(false));
    dispatch(registerUser(data));

    /* работает - не трожь
    registerUser(data, (result) => {
  if (result.success) {
    dispatch(setUser({ user: result.user }));
    dispatch(setErrors(null));
    dispatch(goHome(true));
    dispatch(setSubmit(true));
  } else {
    if (result.errors) {
      dispatch(setSubmit(true));
      dispatch(setUser(result.user));
      dispatch(setErrors(result.errors));
    }
  }
});
    */
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
        <h1 className={styles.title}>Create new account</h1>

        <ul className={styles.inputsList}>
          <li className={styles.inputsItem}>
            <label htmlFor="name" className={styles.label}>
              Username{' '}
            </label>
            <input
              className={styles.input}
              type="text"
              id="name"
              placeholder="Username"
              autoFocus
              style={errors.username && { outline: '1px solid #F5222D' }}
              {...register('username', {
                required: 'Your username can`t be empty.',
                minLength: {
                  value: 3,
                  message: 'Your username needs to be at least 3 characters.',
                },
                maxLength: {
                  value: 20,
                  message: 'Your username needs to be not more than 20 characters.',
                },
              })}
            />
            {servErr?.username && (
              <p className={styles.error}>
                {user.username} {servErr?.username}
              </p>
            )}
            {errors.username && <p className={styles.error}>{errors.username.message}</p>}
          </li>

          <li className={styles.inputsItem}>
            <label htmlFor="email" className={styles.label}>
              Email address{' '}
            </label>
            <input
              className={styles.input}
              type="text"
              id="email"
              placeholder="Email address"
              onKeyUp={() => {
                setValue('email', watch('email').toLowerCase());
              }}
              style={errors.email && { outline: '1px solid #F5222D' }}
              {...register('email', {
                required: 'Your email address can`t be empty',
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Your email address is not correct',
                },
              })}
            />
            {servErr?.email && (
              <p className={styles.error}>
                {user.email} {servErr?.email}
              </p>
            )}
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
                required: 'Your password can`t be empty.',
                minLength: {
                  value: 6,
                  message: 'Your password needs to be at least 6 characters.',
                },
                maxLength: {
                  value: 40,
                  message: 'Your password needs to be not more than 40 characters.',
                },
              })}
            />
            {errors.password && <p className={styles.error}>{errors.password.message}</p>}
          </li>

          <li className={styles.inputsItem}>
            <label htmlFor="repeatPassword" className={styles.label}>
              Repeat Password{' '}
            </label>
            <input
              className={styles.input}
              type="password"
              id="repeatPassword"
              placeholder="Password"
              style={errors.repeatPassword && { outline: '1px solid #F5222D' }}
              {...register('repeatPassword', {
                required: 'Your password can`t be empty.',
                validate: (value) => {
                  const { password } = getValues();
                  return password === value || 'Passwords must match!';
                },
              })}
            />
            {errors.repeatPassword && <p className={styles.error}>{errors.repeatPassword.message}</p>}
          </li>
        </ul>
        <div className={styles.agreement}>
          <label htmlFor="agreement" className={styles.checkLabel}>
            <input
              className={styles.checkbox}
              type="checkbox"
              id="agreement"
              name="agreement"
              style={errors.agreement && { outline: '1px solid #F5222D' }}
              {...register('agreement', {
                required: 'You need to confirm user agreement',
              })}
            />
            I agree to the processing of my personal information
          </label>
        </div>
        {errors.agreement && <p className={styles.error}>{errors.agreement.message}</p>}

        <button type="submit" className={submit} disabled={!submitActive}>
          Create
        </button>

        <span className={styles.signInLabel}>
          Already have an account?{' '}
          <Link className={styles.signIn} to="/SignIn">
            Sign In.
          </Link>
        </span>
      </form>
    </div>
  );
}

export default SignUp;
