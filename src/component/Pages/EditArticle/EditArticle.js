/*
import { useSelector, useDispatch } from 'react-redux';
import { useForm, useFieldArray } from 'react-hook-form';
import { Redirect, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

import { editArticleAPI } from '../../../Reducer/articleSlice';
import { selectAuth } from '../../../Reducer/authSlice';

import './editArticle.css';

const EditArticle = () => {
  const [titleInput, setTitleInput] = useState('');
  const [shortInput, setShortInput] = useState('');
  const [bodyInput, setBodyInput] = useState('');
  const [tagsInput, setTagsInput] = useState([]);
  const isAuth = useSelector(selectAuth);
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    register,
    handleSubmit,
    control,

    formState: { errors, isValid },
  } = useForm({
    mode: 'onSubmit',
    defaultValues: {
      tags: [...tagsInput],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tags',
    rules: {
      required: 'Please append at least 1 item',
    },
  });

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem('token');
      const slug = localStorage.getItem('slug');
      const response = await axios.get(`https://blog.kata.academy/api/articles/${slug}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      setTitleInput(response?.data.article?.title);
      setShortInput(response?.data.article?.description);
      setBodyInput(response?.data.article?.body);
      setTagsInput(response?.data.article?.title);
    }
    fetchData();
  }, []);

  const onSubmit = (data) => {
    const slug = localStorage.getItem('slug');

    const payload = {
      slug,
      userData: {
        article: {
          title: data.title,
          description: data.description,
          body: data.textarea,
          tagList: data.tags.map((el) => el.name),
        },
      },
    };

    dispatch(editArticleAPI(payload));
    history.push('/');
  };
  // чтобы нельзя было перейти на страницу редактирования если не авторизован
  if (!isAuth && !localStorage.getItem('token')) {
    return <Redirect to="/sign-in" />;
  }

  return (
    <div className="form-container">
      <h3 className="form-title">Edit article</h3>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="label-container">
          <label htmlFor="username">
            <span className="title-input">Title</span>
            <input
              className="text-title"
              value={titleInput}
              type="text"
              name="title"
              {...register('title', {
                required: 'The field is required',
              })}
              onChange={(e) => setTitleInput(e.target.value)}
            />
            {errors?.title && <div className="incorrect-data">{errors?.title?.message}</div>}
          </label>
        </div>
        <div className="label-container">
          <label htmlFor="username">
            <span className="title-input">Short description</span>
            <input
              className="text-description"
              value={shortInput}
              type="text"
              name="description"
              {...register('description', {
                required: 'The field is required',
              })}
              onChange={(e) => setShortInput(e.target.value)}
            />
            {errors?.description && <div className="incorrect-data">{errors?.description?.message}</div>}
          </label>
        </div>
        <div className="label-container">
          <label htmlFor="textarea">
            <span className="title-input">Description</span>
            <input
              className="text-description"
              value={bodyInput}
              type="text"
              name="textarea"
              {...register('textarea', {
                required: 'The field is required',
              })}
              onChange={(e) => setBodyInput(e.target.value)}
            />
            {errors?.textarea && <div className="incorrect-data">{errors?.textarea?.message}</div>}
          </label>
        </div>
        <div>
          <span className="title-tag">Title</span>
        </div>
        {fields.length > 0 ? (
          fields.map((field, index) => (
            <section key={field.id}>
              <label htmlFor={`tags.${index}.name`}>
                <input
                  className="text-description"
                  type="text"
                  name={`tags.${index}.name`}
                  {...register(`tags.${index}.name`, {})}
                />
              </label>
              <button
                className="btn_delete-tag"
                type="button"
                onClick={() => {
                  remove(index);
                }}
              >
                Delete Tag
              </button>
              {index === fields.length - 1 && (
                <buttun
                  className="btn_add-tag"
                  type="button"
                  onClick={() => {
                    append({
                      name: '',
                    });
                  }}
                >
                  Add Tag
                </buttun>
              )}

              {index === fields.length - 1 && field.name === '' && (
                <div className="warning-data">Перед отправкой формы, убедитесь что поле не пустое.</div>
              )}
            </section>
          ))
        ) : (
          <button
            className="btn_add-tag"
            type="button"
            onClick={() => {
              append({
                name: '',
              });
            }}
          >
            Add Tag
          </button>
        )}
        <input className="submit-input" type="submit" value="Create" disabled={!isValid} />
      </form>
    </div>
  );
  
};

export default EditArticle;
*/

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, useFieldArray } from 'react-hook-form';
import { useHistory, Redirect } from 'react-router-dom';
import axios from 'axios';

import { selectAuth } from '../../../Reducer/authSlice';
import { editArticleAPI } from '../../../Reducer/articleSlice';

import './editArticle.css';

// компонент создания Статьи
const EditArticle = () => {
  const [titleInput, setTitleInput] = useState('');
  const [shortInput, setShortInput] = useState('');
  const [bodyInput, setBodyInput] = useState('');
  const [tagsInput, setTagsInput] = useState([]);

  const history = useHistory();
  const dispatch = useDispatch();
  const isAuth = useSelector(selectAuth);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onSubmit',
    defaultValues: {
      tags: [...tagsInput],
    },
  });

  // хуки формы
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tags',
    rules: {
      required: 'Please append at least 1 item',
    },
  });

  // получение ранее введённых данных в форму
  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem('token');
      const slug = localStorage.getItem('slug');
      const response = await axios.get(`https://blog.kata.academy/api/articles/${slug}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      setTitleInput(response?.data.article?.title);
      setShortInput(response?.data.article?.description);
      setBodyInput(response?.data.article?.body);
      setTagsInput(response?.data.article?.tagList);
    }
    fetchData();
  }, []);

  // отправка данных формы
  const onSubmit = (data) => {
    const slug = localStorage.getItem('slug');
    const payload = {
      slug,
      userData: {
        article: {
          title: data.title,
          description: data.description,
          body: data.textarea,
          tagList: data.tags.map((el) => el.name),
        },
      },
    };

    dispatch(editArticleAPI(payload));
    history.push('/');
  };

  // чтобы нельзя было перейти на страницу редактирования если не авторизован
  if (!isAuth && !localStorage.getItem('token')) {
    return <Redirect to="/sign-in" />;
  }

  // полученные данные в форму...раскладываю по value...чтоб их отобразить
  return (
    <div className="article-form">
      <h3 className="form-title">Edit article</h3>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="label-container">
          <label htmlFor="username">
            <span className="title-input">Title</span>
            <input
              className="text-title"
              type="text"
              name="title"
              value={titleInput}
              placeholder="Title"
              {...register('title', {
                required: 'The field is required',
              })}
              onChange={(e) => setTitleInput(e.target.value)}
            />
            {errors?.title && <div className="incorrect-data">{errors?.title?.message}</div>}
          </label>
        </div>
        <div className="label-container">
          <label htmlFor="username">
            <span className="title-input">Short description</span>
            <input
              className="text-description"
              type="text"
              name="description"
              value={shortInput}
              placeholder="Title"
              {...register('description', {
                required: 'The field is required ',
              })}
              onChange={(e) => setShortInput(e.target.value)}
            />
            {errors?.description && <div className="incorrect-data">{errors?.description?.message}</div>}
          </label>
        </div>
        <div className="label-container">
          <label htmlFor="textarea">
            <span className="title-input">Description</span>
            <textarea
              className="text-text_area"
              type="text"
              name="textarea"
              value={bodyInput}
              placeholder="Text"
              {...register('textarea', {
                required: 'The field is required ',
              })}
              onChange={(e) => setBodyInput(e.target.value)}
            />
            {errors?.textarea && <div className="incorrect-data">{errors?.textarea?.message}</div>}
          </label>
        </div>
        <div>
          <span className="title-tag">Tags</span>
        </div>
        {fields.length > 0 ? (
          fields.map((field, index) => (
            <section key={field.id}>
              <label htmlFor={`tags.${index}.name`}>
                <input
                  className="tag-input"
                  type="text"
                  name={`tags.${index}.name`}
                  {...register(`tags.${index}.name`, {})}
                />
              </label>
              <button
                className="btn_delete-tag"
                type="button"
                onClick={() => {
                  remove(index);
                }}
              >
                Delete Tag
              </button>
              {index === fields.length - 1 && (
                <button
                  className="btn_add-tag"
                  type="button"
                  onClick={() => {
                    append({
                      name: '',
                    });
                  }}
                >
                  Add Tag
                </button>
              )}

              {index === fields.length - 1 && field.name === '' && (
                <div className="warning-data">Перед отправкой формы, убедитесь что поле не пустое.</div>
              )}
            </section>
          ))
        ) : (
          <button
            className="btn_add-tag"
            type="button"
            onClick={() => {
              append({
                name: '',
              });
            }}
          >
            Add Tag
          </button>
        )}
        <input className="submit-input" type="submit" value="Send" disabled={!isValid} />
      </form>
    </div>
  );
};

export default EditArticle;
