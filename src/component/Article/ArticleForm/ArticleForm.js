/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { fetchArticle } from '../../../Service/platformAPI';
import SingleArticle from '../SingleArticle/SingleArticle';
import { setLocation, setStatus } from '../../../Reducer/slices/status-slice';

import styles from './ArticleForm.module.scss';

function ArticleForm() {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const { token } = useSelector((state) => state.user.user);

  const { articles } = useSelector((state) => state.articles);
  const article = articles.find((item) => item.slug === slug);

  useEffect(() => {
    dispatch(setLocation('article-page'));
    dispatch(setStatus('loading'));
    dispatch(fetchArticle(slug, token));
  }, [dispatch, slug]);

  const articleExist = article && Object.keys(article).length !== 0;

  return <div className={styles.main}>{articleExist && <SingleArticle article={article} />}</div>;
}

export default ArticleForm;
