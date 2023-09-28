import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Pagination, Spin } from 'antd';

import { fetchArticles } from '../../Service/platformAPI';
import { setLimit, setPage } from '../../Reducer/slices/articles-slice';
import { setLocation, setStatus, goHome } from '../../Reducer/slices/status-slice';
import SingleArticle from '../Article/SingleArticle/SingleArticle';

import styles from './ArticleList.module.scss';

function ArticleList() {
  const dispatch = useDispatch();
  const { articles, articlesCount, page, limit } = useSelector((state) => state.articles);
  const status = useSelector((state) => state.status.status);
  const { token } = useSelector((state) => state.user.user);

  const PG = Number(localStorage.getItem('page')) || page;

  useEffect(() => {
    dispatch(goHome(false));
    dispatch(setLocation('articles-list'));
    dispatch(setStatus('loading'));
    dispatch(fetchArticles(page, limit, token));
  }, [page, limit, dispatch, token]);

  const articlez = articles.map((article) => (
    <li key={article.slug}>
      <SingleArticle article={article} />
    </li>
  ));

  const showContent = (stat) => {
    switch (stat) {
      case 'loading':
        return <Spin size="large" />;
      case '404':
        return (
          <Alert
            message="По Вашему запросу ничего не найдено"
            description="Попробуйте изменить запрос"
            type="warning"
            showIcon
          />
        );
      case 'error':
        return <Alert message="Ошибка сервера" description="Попробуйте перезагрузить страницу" type="error" showIcon />;
      case 'offline':
        return (
          <Alert
            className={styles.error}
            message="У вас нет интернет соединения!"
            description="Пожалуйста проверьте ваш кабель"
            type="error"
            showIcon
          />
        );
      default:
        return articlez;
    }
  };

  const content = showContent(status);

  // eslint-disable-next-line no-shadow
  const onPaginationChange = (page) => {
    dispatch(setPage(page));
    const data = {
      offset: (page - 1) * 5,
      token: token || localStorage.token,
      page: Number(localStorage.getItem('page')),
    };
    localStorage.setItem('page', page);
    dispatch(setLimit(limit));
    dispatch(fetchArticles(data));
  };

  return (
    <div className={styles.main}>
      <ul className={styles.list}>{content}</ul>
      {status !== 'error' && (
        <Pagination
          className={styles.pag}
          hideOnSinglePage
          current={PG}
          pageSize={limit}
          pageSizeOptions={[5, 10, 20, 40, 100, 500]}
          total={articlesCount}
          onChange={(PG, pageSize) => onPaginationChange(PG, pageSize)}
        />
      )}
    </div>
  );
}

export default ArticleList;
