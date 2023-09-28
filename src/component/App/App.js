import React, { useEffect } from 'react';
// Router - обёртка для компонентов, чтобы поделить их на части,
// для того чтобы переключаться как по страницам
// Switch - сработает если нет нужного пути у Route...то что я задам после всех Route
// Route - указывает путь, по которому переключаются компоненты
// Redirect - перенаправляет куда укажу если страница недоступна например
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { checkAuth } from '../../Service/loginRegisterAPI';
import { getArticleList } from '../../Service/articleAPI';
// страницы
import Header from '../Header/Header';
import ArticleList from '../ArticleList/ArticleList';
import CreateArticle from '../CreateArticle/CreateArticle';
//import SignIn from '../forms/SignIn';
//import SignUp from '../forms/SignUp';
//import Profile from '../forms/Profile';
import CreatePost from '../Pages/CreatePost';

import styles from './App.module.scss';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
    getArticleList();
  }, []);

  // Route делит компоненты на "страницы" - просто ссылки,
  // на которых показывается одно и скрывается другое
  return (
    <div className={styles.wrapper}>
      <Router>
        <Header />
        <Switch>
          <Route exact path="/" component={ArticleList} />
          <Route exact path="/articles" component={ArticleList} />
          <Route exact path="/articles/:slug" component={CreatePost} />
          <Route path="/sign-up" component={SignUp} />
          <Route path="/sign-in" component={SignIn} />
          <Route path="/profile" component={Profile} />
          <Route path="/new-article" component={CreateArticle} />
          <Route path="/articles/:slug/edit" component={CreateArticle} />
          <Redirect to="/" />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
