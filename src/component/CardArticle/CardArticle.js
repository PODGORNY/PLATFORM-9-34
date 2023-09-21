import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { IoHeartOutline, IoHeartSharp } from 'react-icons/io5';
import { useHistory } from 'react-router-dom';

// подключаю редуктор
import { likeArticleAPI, likeDeleteAPI } from '../../Reducer/articleSlice';
import { selectAuth } from '../../Reducer/authSlice';

import './cardArticle.css';

const CardArticle = ({ username, img, title, date, description, tags, likesNumber, favorited, onClick, slug }) => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectAuth);
  const history = useHistory();
  const handleLikeClick = () => {
    // проверяю, что пользователь авторизован
    if (isAuth) {
      if (!favorited) {
        dispatch(likeArticleAPI(slug));
        localStorage.setItem(`like_${slug}`, true);
      }
      if (favorited) {
        dispatch(likeDeleteAPI(slug));
        localStorage.removeItem(`like_${slug}`);
      }
    } else {
      history.push('/');
    }
  };

  const trimText = (str) => {
    const text = str.slice(0, 40);
    return text + '...';
  };

  return (
    <article className="card">
      <div className="card-wrapper">
        <div className="card-left">
          <div className="title-container">
            <span className="card-title" onClick={onClick}>
              {title.length > 30 ? trimText(title) : title}
            </span>
            <span className="like-container" onClick={handleLikeClick}>
              {localStorage.getItem(`like_${slug}`) ? <IoHeartSharp color="red" /> : <IoHeartOutline />}
              <span className="like-count">{likesNumber}</span>
            </span>
          </div>
          <div className="card-tags">
            {tags?.map((el, i) => (
              <span className="tag" key={i + el}>
                {el}
              </span>
            ))}
          </div>
          <span className="card-description">{description}</span>
        </div>

        <div className="card-right">
          <div className="card-container-right">
            <span className="card-author">{username}</span>
            <span className="card-date">{date ? format(new Date(date), 'MMM dd, yyyy') : null}</span>
          </div>
          <img className="card-image" src={img || null} alt={username} />
        </div>
      </div>
    </article>
  );
};

export default CardArticle;
