import { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Skeleton } from 'antd';

import CardArticleDetails from '../../../component/CardArticleDetails/CardArticleDetails';
import { fullArticleAPI } from '../../../Service/API';

//
function Details() {
  // изначально нет статьи
  const [article, setArticle] = useState(null);
  const { push } = useHistory();
  const { slug } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (slug) {
          const response = await fullArticleAPI(slug);
          setArticle(response);
        }
      } catch (error) {
        throw new Error(error);
      }
    };
    fetchData();
  }, [slug]);

  return (
    <div>{article ? <CardArticleDetails push={push} {...article} /> : <Skeleton style={{ marginTop: '20px' }} />}</div>
  );
}

export default Details;
