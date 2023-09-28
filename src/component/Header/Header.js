import React from 'react';
// Link - создаёт ссылку на компонент...для Route
// useHistory - нужен, чтобы передавать id компонента
import { Link, useHistory } from 'react-router-dom';
// useSelector - достаёт данные из стейта в редукторе
import { useSelector, useDispatch } from 'react-redux';

// выход
import { setlogOut } from '../../Service/loginRegisterAPI';
import './Header.module.scss';

export default function Header() {
  const dispatch = useDispatch();
  // проверка авторизации
  const { logged, user } = useSelector((state) => state.reduserLogin);
  const image = user.image ? user.image : 'https://i.pinimg.com/736x/40/ce/e2/40cee25e2b1356a3918935347e6d76b6.jpg';
  const name = user ? user.username : 'none';
  const history = useHistory();

  const handleLogOut = () => {
    dispatch(setlogOut());
    history.push('/sign-in');
  };

  const handleEditProfile = () => {
    history.push('/profile');
  };

  return (
    <div className={styles.header}>
      <Link to="/">Realworld Blog</Link>
      <div className={styles.header__btn}>
        {logged ? (
          <>
            <Link to="/new-article" className={styles.create_article}>
              Create article
            </Link>
            <span className={styles.name} onClick={handleEditProfile}>
              {name}
            </span>
            <img src={image} className={styles.image} onClick={handleEditProfile} />
            <button className={styles.log_out} onClick={handleLogOut}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/sign-in" className={styles.sign_in}>
              Sign in
            </Link>
            <Link to="/sign-up" className={styles.sign_up}>
              Sign up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
