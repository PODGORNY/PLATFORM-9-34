/* eslint-disable import/no-unresolved */
import React, { useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import Tag from '../../Tag/Tag';
import { editArticle } from '../../../Service/platformAPI';
import { setErrors } from '../../../Reducer/slices/user-slice';
import { createTags } from '../../../Reducer/slices/tags-slice';
import { setSubmit } from '../../../Reducer/slices/status-slice';

import styles from './CreateArticle.module.scss';

const areaStyle = classNames(styles.input, styles.textarea);

function CreateArticle() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { slug } = useParams();

  const { articles } = useSelector((state) => state.articles);
  const article = articles.find((item) => item.slug === slug);
  const { tags } = useSelector((state) => state.tags);
  const { token, username } = useSelector((state) => state.user.user);
  const { home, submitActive, goTo } = useSelector((state) => state.status);
  const sendBtn = submitActive
    ? classNames(styles.btn, styles.send)
    : classNames(styles.btn, styles.send, styles.disabledBtn);

  const tagz = tags.map((tag, idx) => (
    <li key={tag.id} className={styles.tagWrapper}>
      <Tag idx={idx} id={tag.id} value={tag.label} tagsLength={tags.length} />
    </li>
  ));

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const sendTags = tags.map((tag) => tag.label).filter((tag) => tag !== '');

  const onSubmit = (data) => {
    dispatch(setSubmit(false));
    slug ? dispatch(editArticle(data, sendTags, token, slug)) : dispatch(editArticle(data, sendTags, token));
  };
  const memToken = useMemo(() => token, []);

  useEffect(() => {
    if (goTo) navigate(`/articles/${goTo}`);
  }, [goTo]);

  useEffect(() => {
    if (slug && article?.username !== username) navigate('/');
    if (!memToken) navigate('/');
    if (home) navigate('/');
    dispatch(setErrors(null));
  }, [home, dispatch, navigate, memToken, slug]);

  useEffect(() => {
    if (slug && article && Object.keys(article).length > 0) {
      const newTags = [];
      article.tags.forEach((tag) => {
        newTags.push({
          id: uuidv4(),
          label: tag,
        });
      });
      dispatch(createTags(newTags));
    } else {
      dispatch(createTags([{ id: uuidv4(), label: '' }]));
    }
  }, [dispatch, slug, article]);

  return (
    <div className={styles.main}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <h1 className={styles.title}>{slug ? 'Edit article' : 'Create new article'}</h1>
        <ul className={styles.inputsList}>
          <li>
            <label htmlFor="title" className={styles.label}>
              Title
              <input
                id="title"
                type="text"
                placeholder="Title"
                className={styles.input}
                defaultValue={slug && article && article.title}
                autoFocus
                required
                {...register('title', {
                  required: 'Title can`t be empty.',
                })}
              />
            </label>
            {errors.title && <p className={styles.error}>{errors.title.message}</p>}
          </li>

          <li>
            <label htmlFor="description" className={styles.label}>
              Short description
              <input
                id="description"
                type="text"
                placeholder="Short description"
                className={styles.input}
                defaultValue={slug && article && article.description}
                {...register('description', {
                  required: 'Description can`t be empty.',
                })}
              />
            </label>
            {errors.description && <p className={styles.error}>{errors.description.message}</p>}
          </li>

          <li>
            <label htmlFor="text" className={styles.label}>
              Text
              <textarea
                id="text"
                placeholder="Text"
                className={areaStyle}
                defaultValue={slug && article && article.text}
                {...register('body', {
                  required: 'Text can`t be empty.',
                })}
              />
            </label>
            {errors.body && <p className={styles.error}>{errors.body.message}</p>}
          </li>

          <li>
            <label htmlFor="tags" className={styles.label}>
              Tags
              <ul className={styles.tagsList}>{tagz}</ul>
            </label>
          </li>
        </ul>
        <button type="submit" className={sendBtn} disabled={!submitActive}>
          Send
        </button>
      </form>
    </div>
  );
}

export default CreateArticle;
