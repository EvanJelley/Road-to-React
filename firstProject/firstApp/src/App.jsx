/* eslint-disable */

import * as React from 'react'
import './App.css'

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const App = () => {
  console.log('Rendering App');

  const storiesReducer = (state, action) => {
    switch (action.type) {
      case 'STORIES_FETCH_INIT':
        return {
          ...state,
          isLoading: true,
          isError: false,
        };
      case 'STORIES_FETCH_SUCCESS':
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: action.payload
        }
      case 'STORIES_FETCH_FAILURE':
        return {
          ...state,
          isLoading: false,
          isError: true,
        };
      case 'REMOVE_STORY':
        return {
          ...state,
          data: state.data.filter(story => action.payload.objectID !== story.objectID),
        }
      default:
        throw new Error();
    }
  }

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
  );

  const [searchTerm, setSearchTerm] = React.useState(localStorage.getItem('search') || '');

  React.useEffect(() => {
    if (!searchTerm) return;

    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    fetch(`${API_ENDPOINT}${searchTerm}`)
      .then((response) => response.json())
      .then((result) => {
        dispatchStories({
          type: 'STORIES_FETCH_SUCCESS',
          payload: result.hits,
        });
      })
      .catch(() =>
        dispatchStories({ type: 'STORIES_FETCH_FAILURE' }));
  }, [searchTerm]);

  const handleRemoveStory = item => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  }

  React.useEffect(() => {
    localStorage.setItem('search', searchTerm)
  }, [searchTerm])

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <InputWithLabel
        id="search"
        value={searchTerm}
        onInputChange={handleSearch}
        isFocused
      >
        <strong>Search: </strong>
      </InputWithLabel>

      {stories.isError && <p>Something went wrong ...</p>}

      <hr />
      {stories.isLoading ? (<p>Loading...</p>) :
        (<List list={stories.data} onRemoveItem={handleRemoveStory} />)
      }

      <hr />
    </div>
  )
}


const List = ({ list, onRemoveItem }) => {
  console.log('Rendering List')
  return (
    < ul >
      {list.map(item => (
        <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />))}
    </ul >
  );
}

const Item = ({ item, onRemoveItem }) => {
  return (
    <li>
      <a href={item.url}>{item.title}</a> - {item.author}
      <button type="button" onClick={() => onRemoveItem(item)}>Delete</button>
    </li>
  )
}


const InputWithLabel = ({ id, value, type = "text", onInputChange, isFocused, children }) => {
  console.log('Rendering Search')

  return (
    <>
      <label htmlFor={id}>{children}</label>
      <input id={id} type={type} autoFocus={isFocused} onChange={onInputChange} value={value} />
    </>
  )
}

export default App
