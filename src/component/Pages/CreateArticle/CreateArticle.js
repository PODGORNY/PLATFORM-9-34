import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, useFieldArray } from 'react-hook-form';
import { useHistory, Redirect } from 'react-router-dom';

import { selectAuth } from '../../../Reducer/authSlice';
import { createArticleAPI } from '../../../Reducer/articleSlice';

import './createArticle.css';

// компонент создания Статьи
const CreateArticle = () => {
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
      tags: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tags',
    rules: {
      required: 'Please append at least 1 item',
    },
  });

  // отправка данных формы
  const onSubmit = (data) => {
    const userData = {
      article: {
        title: data.title,
        description: data.description,
        body: data.textarea,
        tagList: data.tags.map((el) => el.name),
      },
    };

    // после создания статьи переходить сразу на нее
    dispatch(createArticleAPI(userData)).then((res) => {
      localStorage.setItem('slug', res.payload.slug);
      history.push(`/articles/${res.payload.slug}`);
      localStorage.removeItem('slug');
    });
  };

  // чтобы нельзя было перейти на страницу редактирования если не авторизован
  if (!isAuth && !localStorage.getItem('token')) {
    return <Redirect to="/sign-in" />;
  }

  return (
    <div className="article-form">
      <h3 className="form-title">Create new article</h3>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="label-container">
          <label htmlFor="username">
            <span className="title-input">Title</span>
            <input
              className="text-title"
              type="text"
              name="title"
              placeholder="Title"
              {...register('title', {
                required: 'The field is required',
              })}
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
              placeholder="Title"
              {...register('description', {
                required: 'The field is required ',
              })}
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
              placeholder="Text"
              {...register('textarea', {
                required: 'The field is required ',
              })}
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
                  placeholder="Tag"
                  name={`tags.${index}.name`}
                  {...register(`tags.${index}.name`, {
                    required: 'The field is required ',
                  })}
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

export default CreateArticle;
