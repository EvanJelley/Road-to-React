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
        data: action.payload.page === 0 ? action.payload.stories : state.data.concat(action.payload.stories),
        page: action.payload.page,
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

const API_BASE = 'https://hn.algolia.com/api/v1';
const API_SEARCH = '/search?query=';
const API_PAGE = '&page=';

const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState(
    'search',
    'React'
  );

  const getUrl = (searchTerm, page, searchStore) => {
    return {
      address: `${API_BASE}${API_SEARCH}${searchTerm}${API_PAGE}${page}`,
      pastSearches: searchStore,
    };
  };

  const [url, setUrl] = React.useState(() => getUrl(searchTerm, 0, []));

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false, page: 0 }
  );

  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    try {
      const result = await axios.get(url.address);
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: {
          stories: result.data.hits,
          page: result.data.page,
        },
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
        setUrl(getUrl(searchTerm, 0, searches));
        event.preventDefault();
        return;
      }
    }
    if (url.pastSearches.length < 5) {
      let searches = url.pastSearches;
      searches.unshift(searchTerm);
      setUrl(getUrl(searchTerm, 0, searches));
    } else {
      let searches = url.pastSearches.slice(0, 4);
      searches.unshift(searchTerm);
      setUrl(getUrl(searchTerm, 0, searches));
    }

    event.preventDefault();
  };

  const handleMore = () => {
    setUrl(getUrl(searchTerm, stories.page + 1, url.pastSearches));
  }

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

      <List list={stories.data} onRemoveItem={handleRemoveStory} />

      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <button className='button' onClick={handleMore}>
          More
        </button>
      )}

    </div>
  );
};

export default App;

