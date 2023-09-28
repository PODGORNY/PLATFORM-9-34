import React from 'react';
// Router - обёртка для компонентов, чтобы поделить их на части,
// для того чтобы переключаться как по страницам
// Switch - сработает если нет нужного пути у Route...то что я задам после всех Route
// Route - указывает путь, по которому переключаются компоненты
// Redirect - перенаправляет куда укажу если страница недоступна например
import { Routes, Route } from 'react-router-dom';

// страницы
import Layout from '../../component/Layout/Layout';
import ArticleList from '../../component/ArticleList/ArticleList';
import ArticleForm from '../../component/Article/ArticleForm/ArticleForm';
import SignUp from '../User/SignUp/SignUp';
import SignIn from '../User/SignIn/SignIn';
import Profile from '../User/Profile/Profile';
import CreateArticle from '../../component/Article/CreateArticle/CreateArticle';

function App() {
  // Route делит компоненты на "страницы" - просто ссылки,
  // на которых показывается одно и скрывается другое
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ArticleList />} />
          <Route path="/articles/" element={<ArticleList />} />
          <Route path="/articles/page=?:" element={<ArticleList />} />
          <Route path="/articles/:slug" element={<ArticleForm />} />
          <Route path="/articles/:slug/edit" element={<CreateArticle />} />
          <Route path="/new-article" element={<CreateArticle />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
