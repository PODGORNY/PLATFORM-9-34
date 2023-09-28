import React, { useEffect } from 'react';
import classNames from 'classnames';
// Link - создаёт ссылку на компонент...для Route
// useHistory - нужен, чтобы передавать id компонента
import { Link } from 'react-router-dom';
// useSelector - достаёт данные из стейта в редукторе
import { useSelector, useDispatch } from 'react-redux';

// выход
import { logOut } from '../../Reducer/slices/user-slice';
import { getUser } from '../../Service/platformAPI';

import styles from './Header.module.scss';

const link = classNames(styles.link);
const signUp = classNames(link, styles.signUp);
const createArticle = classNames(link, styles['create-article']);
const logOutBtn = classNames(link, styles['log-out']);

function Header() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const avatar = user.image ? user.image : 'https://static.productionready.io/images/smiley-cyrus.jpg';

  const onLogOut = () => {
    localStorage.removeItem('user');
    dispatch(logOut());
  };

  useEffect(() => {
    if (token) {
      dispatch(getUser(token));
    }
  }, []);

  const headerAuthorization = (
    <ul className={styles.authorization}>
      <li>
        <Link className={link} to="/sign-in">
          Sign In
        </Link>
      </li>
      <li>
        <Link className={signUp} to="/sign-up">
          Sign Up
        </Link>
      </li>
    </ul>
  );

  const headerMenu = (
    <div className={styles.menu}>
      <Link to="/new-article" className={createArticle}>
        Create article
      </Link>
      <Link to="/profile" className={styles.user}>
        <span className={styles.userName}>{user.username}</span>
        <img className={styles.user__avatar} src={avatar} alt="avatar" />
      </Link>
      <Link to="/" className={logOutBtn} onClick={() => onLogOut()}>
        Log Out
      </Link>
    </div>
  );

  return (
    <div className={styles.main}>
      <Link to="/articles" className={styles.label}>
        Realworld Blog
      </Link>
      {token ? headerMenu : headerAuthorization}
    </div>
  );
}

export default Header;
