import React, { useState, useEffect } from 'react';
import { Pagination, Spin } from 'antd';

import { getArticleList } from '../../Service/articleAPI';
import Article from '../Article/Article';

import './ArticleList.module.scss';

function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(false);
  const [articlesCount, setArticlesCount] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [load, setLoaded] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    getArticleList(currentPage)
      .then((body) => {
        setArticles(body.articles), setArticlesCount(body.articlesCount);
        setLoaded(false);
      })
      .catch(() => setError(true));
  }, [token]);

  const onChangePage = (page) => {
    getArticleList(page)
      .then((body) => {
        setArticles(body.articles), setArticlesCount(body.articlesCount);
        setLoaded(false);
      })
      .catch(() => setError(true));
    setCurrentPage(page);
  };

  const loaded = load ? <Spin size="large" /> : null;
  const showError = error ? 'Error' : null;

  return (
    <div className={styles.article__list}>
      {loaded}
      {showError}
      {articles.map((item) => {
        return <Article key={item.slug} data={item} />;
      })}
      {articles.length !== 0 ? (
        <Pagination
          defaultCurrent={1}
          total={articlesCount}
          showSizeChanger={false}
          className={styles.pagination}
          onChange={onChangePage}
          current={currentPage}
        />
      ) : null}
    </div>
  );
}

export default ArticleList;
