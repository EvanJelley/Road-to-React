/* eslint-disable */
import * as React from 'react';
import axios from 'axios';
import { sortBy } from 'lodash';

import './App.css';


import { SearchForm } from './SearchForm';
import { List } from './List';

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
        data: action.payload,
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};

const useStorageState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState(
    'search',
    'React'
  );

  const [url, setUrl] = React.useState({
    address: `${API_ENDPOINT}${searchTerm}`,
    pastSearches: [searchTerm],
  });

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
  );

  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    try {
      const result = await axios.get(url.address);
      console.log(`Past Searches: ${url.pastSearches}`)
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
    }
  }, [url]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    for (let i = 0; i < url.pastSearches.length; i++) {
      if (url.pastSearches[i] === searchTerm) {
        let searches = url.pastSearches;
        searches.splice(i, 1);
        searches.unshift(searchTerm);
        setUrl({ address: `${API_ENDPOINT}${searchTerm}`, pastSearches: searches });
        event.preventDefault();
        return;
      }
    }
    if (url.pastSearches.length < 5) {
      let searches = url.pastSearches;
      searches.unshift(searchTerm);
      setUrl({ address: `${API_ENDPOINT}${searchTerm}`, pastSearches: searches });
    } else {
      let searches = url.pastSearches.slice(0, 4);
      searches.unshift(searchTerm);
      setUrl({ address: `${API_ENDPOINT}${searchTerm}`, pastSearches: searches });
    }

    event.preventDefault();
  };

  return (
    <div className='container'>
      <h1 className='headline-primary'>My Hacker Stories</h1>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      <p>Previous Searches:</p>
      {url.pastSearches.map((search) => (
        <button
          key={search}
          onClick={() => setUrl({ address: `${API_ENDPOINT}${search}`, pastSearches: url.pastSearches })}
          className='button button_small'
          style={{ margin: '0 10px' }}
        >
          {search}
        </button>
      ))}

      <hr />

      {stories.isError && <p>Something went wrong ...</p>}

      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
};

export default App;

