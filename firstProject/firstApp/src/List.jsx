/* eslint-disable */

import * as React from 'react';
import { sortBy } from 'lodash';
import './App.css';


const List = ({ list, onRemoveItem }) => {

  const SORTS = {
    NONE: (list) => list,
    TITLE: (list, isReverse) => isReverse ? sortBy(list, 'title').reverse() : sortBy(list, 'title'),
    AUTHOR: (list, isReverse) => isReverse ? sortBy(list, 'author').reverse() : sortBy(list, 'author'),
    COMMENTS: (list, isReverse) => isReverse ? sortBy(list, 'num_comments').reverse() : sortBy(list, 'num_comments'),
    POINTS: (list, isReverse) => isReverse ? sortBy(list, 'points').reverse() : sortBy(list, 'points'),
  };

  const [sort, setSort] = React.useState({
    key: 'NONE',
    isReverse: false,
  });

  const handleSortStories = (sortKey) => {
    if (sort.key === sortKey && !sort.isReverse) {
      setSort({ key: sortKey, isReverse: true })
    } else {
      setSort({ key: sortKey, isReverse: false })
    }
  };

  const sortFunction = SORTS[sort.key];
  const sortedList = sortFunction(list, sort.isReverse);

  return (
    <div>
      <ul>
        <li className='list-header'>
          <span style={{ width: '40% ' }}>
            <button onClick={() => handleSortStories('TITLE')} className='button button-header'>Title</button>
          </span>
          <span style={{ width: '30% ' }}>
            <button onClick={() => handleSortStories('AUTHOR')} className='button button-header'>Author</button>
          </span>
          <span style={{ width: '10% ' }}>
            <button onClick={() => handleSortStories('COMMENTS')} className='button button-header'>Comments</button>
          </span>
          <span style={{ width: '10% ' }}>
            <button onClick={() => handleSortStories('POINTS')} className='button button-header'>Points</button>
          </span>
          <span style={{ width: '10% ' }}>Dismiss</span>
        </li>
        {sortedList.map((item) => (
          <Item
            key={item.objectID}
            item={item}
            onRemoveItem={onRemoveItem}
          />
        ))}
      </ul>
    </div>
  )
};

const Item = ({ item, onRemoveItem }) => (
  <li className='item'>
    <span style={{ width: '40% ' }}>
      <a href={item.url}>{item.title}</a>
    </span>
    <span style={{ width: '30% ' }}>{item.author}</span>
    <span style={{ width: '10% ' }}>{item.num_comments}</span>
    <span style={{ width: '10% ' }}>{item.points}</span>
    <span style={{ width: '10% ' }}>
      <button type="button" onClick={() => onRemoveItem(item)} className='button button_small'>
        Dismiss
      </button>
    </span>
  </li>
);

export { List };