/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Spin } from 'antd';
// useNavigate - новый useHistory
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import classNames from 'classnames';

import { deleteArticle, fetchArticle, fetchArticles, setLike } from '../../../Service/platformAPI';
import { setGoTo } from '../../../Reducer/slices/status-slice';

import styles from './SingleArticle.module.scss';

function SingleArticle({ article }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { slug } = useParams();

  const { location } = useSelector((state) => state.status);
  const { user } = useSelector((state) => state.user);
  const { username, token } = user;

  const cardStyle = location === 'articles-list' ? styles.preview : classNames(styles.preview, styles.singleCard);

  const [modal, setModal] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const title = article.title.length < 1 ? 'NO TITLED ARTICLE' : article.title;
  const articlePath = `/articles/${article.slug}`;
  const { page, limit } = useSelector((state) => state.articles);

  useEffect(() => {
    if (location === 'article-page') dispatch(setGoTo(''));
  }, []);

  useEffect(() => {
    setAvatar(article.avatarPath);
  }, [article.avatarPath]);

  const printTags = (post) =>
    post.tags.map((tag) => {
      const tagStr = String(tag);
      if (tagStr.length > 20 || tagStr.length < 1) return null;
      return (
        <li key={uuidv4()} className={styles.tag}>
          {tagStr}
        </li>
      );
    });

  const onLike = () => {
    if (token) {
      dispatch(setLike(token, article.slug, article.liked));
      location === 'article-page'
        ? dispatch(fetchArticle(article.slug, token))
        : dispatch(fetchArticles(page, limit, token));
    }
  };

  const onDelete = () => {
    navigate('/');
    dispatch(deleteArticle(token, slug));
  };
  const likeStyl = classNames(styles.blackLike, token && styles.activeLike, article.liked && styles.redLike);

  const deleteBtn = classNames(styles.btn, styles.delete);
  const editBtn = classNames(styles.btn, styles.edit);
  const yesBtn = classNames(styles.btn, styles.yes);
  const noBtn = classNames(styles.btn, styles.no);

  return (
    <div className={styles.cardWrapper}>
      <div className={cardStyle}>
        <section className={styles.content}>
          <div className={styles.titleWrapper}>
            <Link to={articlePath} className={styles.title}>
              {title}
            </Link>
            {/* eslint-disable-next-line react/button-has-type */}
            <button onClick={() => onLike()} className={likeStyl}>
              {article.likes}
            </button>
          </div>
          <ul className={styles.tags}>{printTags(article)}</ul>
          <p className={styles.description}>{article.description}</p>
        </section>
        <section className={styles.info}>
          <div className={styles.authInfo}>
            <div className={styles.infoWrapper}>
              <span className={styles.author}>{article.username}</span>
              <span className={styles.date}>{article.updatedDate}</span>
            </div>
            {loading && <Spin style={{ position: 'absolute', right: '30px', top: '20px' }} />}
            <img
              alt="avatar"
              src={avatar}
              className={styles.avatar}
              onLoad={() => {
                setLoading(false);
              }}
              onError={() => setAvatar('/no-avatar.png')}
            />
          </div>
          {location === 'article-page' && article.username === username && (
            <ul className={styles.control}>
              <li>
                <button className={deleteBtn} type="button" onClick={() => setModal(true)}>
                  Delete
                </button>
              </li>
              <li>
                <button type="button" className={editBtn} onClick={() => navigate(`/articles/${slug}/edit`)}>
                  Edit
                </button>
              </li>
            </ul>
          )}
        </section>
      </div>
      {/* eslint-disable-next-line react/no-children-prop */}
      {location === 'article-page' && <ReactMarkdown children={article.text} className={styles.pageText} />}

      {modal && (
        <div className={styles.modal}>
          <span className={styles.modalLabel}>Are you sure to delete this article?</span>
          <div className={styles.modalBtns}>
            <button type="button" className={noBtn} onClick={() => setModal(false)}>
              No
            </button>
            <button type="button" className={yesBtn} onClick={() => onDelete()}>
              Yes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SingleArticle;
