import React from 'react';
import { Avatar } from 'antd';
// Link - создаёт ссылку на компонент...для Route
// useHistory - нужен, чтобы передавать id компонента
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// авторизация, выход
import { selectAuth, logout } from '../../Reducer/authSlice';
import './header.css';

const Header = () => {
  const isAuth = useSelector(selectAuth);
  const dispatch = useDispatch();
  const history = useHistory();
  const name = JSON.parse(localStorage.getItem('data'));
  const image = JSON.parse(localStorage.getItem('image'));
  const onClickLogout = () => {
    if (window.confirm('Хотите выйти?')) {
      dispatch(logout());
      history.push('/');
      localStorage.clear();
    }
  };

  return (
    <header className="header">
      <div className="header_wrapper">
        <div className="btn_wrapper">
          <Link to={'/'} className="btn_name-web">
            ValleyWorld
          </Link>
        </div>
        <div className="btn_container">
          {isAuth ? (
            <>
              <Link to={'/new-article'} className="btn create_article">
                Create article
              </Link>
              <Link to={'/profile'} className="username">
                {name?.user?.username}
              </Link>
              <img
                src={
                  image
                    ? name.user.image
                    : 'https://sun9-26.userapi.com/impg/zblbzn0DDLjYUn23kH4gxKoggF5ZrcaYXcpp0g/_L1h_-mzxrQ.jpg?size=240x240&quality=96&sign=75e27091bf4a09f67cff4865d8b73ec6&type=album'
                }
              />
              <button className="btn log_out" onClick={onClickLogout}>
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to={'/sign-in'} className="btn sign_in">
                Sign In
              </Link>
              <Link to={'/sign-up'} className="btn sign_up">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
