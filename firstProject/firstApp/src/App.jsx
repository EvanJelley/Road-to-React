/* eslint-disable */
import * as React from 'react'
import './App.css'
import axios from 'axios'

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const getSumComments = stories => {
  console.log('Calculating the sum of comments');
  return stories.data.reduce(
    (result, value) => result + value.num_comments,
    0
  )
}


const App = () => {
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

  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);

  const handleSearchInput = event => {
    setSearchTerm(event.target.value)
  };

  const handleSearchSubmit = (event) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  };

  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    try {
      const result = await axios.get(url)
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' })
    };
  }, [url]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = React.useCallback(item => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  }, []);

  React.useEffect(() => {
    localStorage.setItem('search', searchTerm)
  }, [searchTerm])

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  console.log('Rendering App');

  const sumComments = React.useMemo(() =>
    getSumComments(stories),
    [stories]
  );

  return (
    <div className='container'>
      <h1 className='headline-primary'>My Hacker Stories</h1>
      <p>Total Comments: {sumComments}</p>

      <SearchForm searchTerm={searchTerm} onSearchInput={handleSearchInput} onSearchSubmit={handleSearchSubmit} />

      {stories.isError && <p>Something went wrong ...</p>}

      {stories.isLoading ? (<p>Loading...</p>) :
        (<List list={stories.data} onRemoveItem={handleRemoveStory} />)
      }

    </div>
  )
}

const SearchForm = ({ searchTerm, onSearchInput, onSearchSubmit }) => {
  return (
    <form onSubmit={onSearchSubmit} className='search-form'>
      <InputWithLabel
        id="search"
        value={searchTerm}
        onInputChange={onSearchInput}
        isFocused
      >
        <strong>Search: </strong>
      </InputWithLabel>

      <button
        type="submit"
        disabled={!searchTerm}
        className='button button_large'
      >
        Submit
      </button>
    </form>
  )
}

const List = React.memo(
  ({ list, onRemoveItem }) => {
    console.log('Rendering List')
    return (
      < ul >
        {list.map(item => (
          <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />))}
      </ul >
    );
  }
);

const Item = ({ item, onRemoveItem }) => {
  return (
    <li className='item'>
      <span style={{ width: '40%' }}>
        <a href={item.url}>{item.title}</a>
      </span>
      <span style={{ width: '30%' }}>{item.author}</span>
      <span style={{ width: '10%' }}>{item.num_comments}</span>
      <span style={{ width: '10%' }}>{item.points}</span>
      <span style={{ width: '10%' }}>
        <button className='button button_small' type="button" onClick={() => onRemoveItem(item)}>
          Delete
        </button>
      </span>
    </li>
  )
}


const InputWithLabel = ({ id, value, type = "text", onInputChange, isFocused, children }) => {
  return (
    <>
      <label htmlFor={id} className='label'>{children}</label>
      <input id={id} type={type} autoFocus={isFocused} onChange={onInputChange} value={value} className='input' />
    </>
  )
}

export default App
