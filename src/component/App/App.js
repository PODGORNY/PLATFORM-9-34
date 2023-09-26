// Switch - сработает если нет нужного пути у Route...то что я задам после всех Route
// Route - указывает путь, по которому переключаются компоненты
// Redirect - перенаправляет куда укажу если страница недоступна например
import { Switch, Route, Redirect } from 'react-router-dom';
// достаёт из стэйта в сторе данные
import { useSelector } from 'react-redux';
import { Alert } from 'antd';
import { useState, useEffect } from 'react';

import { fullArticleAPI } from '../../Service/API';
import Header from '../Header/Header';
import Main from '../Main/Main';
import Home from '../Pages/Home/Home';
import Details from '../Pages/Details/Details';
import EditArticle from '../Pages/EditArticle/EditArticle';
import CreateArticle from '../Pages/CreateArticle/CreateArticle';
import LoginForm from '../Pages/LoginForm/LoginForm';
import RegistrationForm from '../Pages/RegistrationForm/RegistrationForm';
import EditProfileForm from '../Pages/EditProfileForm/EditProfileForm';

function App() {
  // на старте нет статей
  const [article, setArticle] = useState(null);
  // проверка автора статьи
  const isAuthor = () => {
    const data = JSON.parse(localStorage.getItem('data'));
    return data?.user?.username === article?.author?.username;
  };
  //
  const slug = localStorage.getItem('slug');
  // получаю статус из стора
  const status = useSelector((state) => state.articles.status);
  const error = status === 'rejected' && (
    <Alert message="Подожди, отдохни пока. Мы устраняем ошибку" type="error" showIcon />
  );

  // при измененнии slug - отправлять запрос на сервер и получать статью
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (slug) {
          const response = await fullArticleAPI(slug);
          setArticle(response);
        }
      } catch (error) {
        throw new Error(error);
      }
    };
    fetchData();
  }, [slug]);

  // Route делит компоненты на "страницы" - просто ссылки,
  // на которых показывается одно и скрывается другое
  return (
    <>
      <Header />
      <Main>
        {error}
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/articles/:slug/edit">{isAuthor() ? <EditArticle /> : <Redirect to="/" />}</Route>
          <Route path="/articles/:slug" component={Details} />
          <Route path="/:new-article" component={CreateArticle} />
          <Route path="/:sign-in" component={LoginForm} />
          <Route path="/:sign-up" component={RegistrationForm} />
          <Route path="/:profile" component={EditProfileForm} />
          <Redirect to="/" />
        </Switch>
      </Main>
    </>
  );
}

export default App;
