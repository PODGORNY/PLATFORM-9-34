// useCallback - кэширует функцию и возвращает её туже если данные не изменились
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Pagination } from 'antd';

import { articleAPI, changePage } from '../../../Reducer/articleSlice';
import ListCard from '../../ListCard/ListCard';
import CardArticle from '../../CardArticle/CardArticle';
import { allArticle } from '../../../Service/API';

import './home.css';

// главная страница приложения...что здесь должно быть, это и получаю
// страница со статьями
// переключение страниц - пагинация
const Home = () => {
  // получение статей и страниц из стэйт
  const articles = useSelector((state) => state.articles.articles);
  const pageArticles = useSelector((state) => state.articles.page);
  // инициализация
  const dispatch = useDispatch();
  const { push } = useHistory();
  const [results, setResults] = useState(1);

  // получение количества статей с сервера
  const articleDataAPI = useCallback(async () => {
    const res = await allArticle();
    setResults(res);
    dispatch(articleAPI((pageArticles - 1) * 5));
  }, [dispatch, pageArticles]);

  // пагинация - переключение страниц
  useEffect(() => {
    articleDataAPI();
  }, [articleDataAPI]);

  const articlePagination = (
    <Pagination
      current={pageArticles}
      total={results}
      // чтобы при нажатии на ValleyWorld, пагинация не сбивалась
      onChange={(page) => dispatch(changePage(page))}
      pageSize={5}
      showSizeChanger={false}
    />
  );

  return (
    <ListCard>
      {articles?.map((el, i) => (
        <CardArticle
          // eslint-disable-next-line react/no-array-index-key, no-unsafe-optional-chaining
          key={el?.createdAt + i}
          username={el?.author?.username}
          img={el?.author?.image}
          title={el?.title}
          date={el?.createdAt}
          description={el?.description}
          tags={el?.tagList}
          likesNumber={el?.favoritesCount}
          favorited={el?.favorited}
          slug={el?.slug}
          onClick={() => push(`/articles/${el.slug}`)}
        />
      ))}
      {articles.length > 0 && articlePagination}
    </ListCard>
  );
};

export default Home;
