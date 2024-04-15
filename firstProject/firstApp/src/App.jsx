/* eslint-disable */
import * as React from 'react'
import './App.css'
import axios from 'axios'

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

      <SearchForm searchTerm={searchTerm} onSearchInput={handleSearchInput} onSearchSubmit={handleSearchSubmit} />

      {stories.isError && <p>Something went wrong ...</p>}

      <hr />
      {stories.isLoading ? (<p>Loading...</p>) :
        (<List list={stories.data} onRemoveItem={handleRemoveStory} />)
      }

      <hr />
    </div>
  )
}

const SearchForm = ({ searchTerm, onSearchInput, onSearchSubmit }) => {
  return (
    <form onSubmit={onSearchSubmit}>
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
      >
        Submit
      </button>
    </form>
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
