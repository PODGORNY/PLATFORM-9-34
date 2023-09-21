import React from 'react';

import './listCard.css';

function List({ children }) {
  return <section className="wrapper">{children}</section>;
}

export default List;
