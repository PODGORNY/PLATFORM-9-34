import { useSelector } from 'react-redux';
import { Spin } from 'antd';

import './main.css';

const Main = ({ children }) => {
  // под индикатор загрузки
  const status = useSelector((state) => state.articles.status);
  const articles = useSelector((state) => state.articles.articles);
  const loading = articles.length === 0 && status === 'loading' && <Spin />;

  return (
    <div className="main">
      <div className="container">{children}</div>
      {loading}
    </div>
  );
};

export default Main;
