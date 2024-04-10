/* eslint-disable */

import * as React from 'react'
import './App.css'

const getGreeting = (greeting, title) => {
  return `${greeting} ${title}`
}

let nums = [1, 2, 3, 4, 5]

const greeting = 'Hello'
const title = 'World'

const App = () => {
  console.log('Rendering App')
  const stories = [
    {
      title: 'React',
      url: 'https://reactjs.org/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0,
    }, {
      title: 'Redux',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ]
  return (
    <div>
      <h1>{getGreeting(greeting, title)}</h1>
      <p>Here are some numbers: {(nums.map(num => <span>{num}, </span>))}</p>
      <p>Here they are squared: {nums.map(num => <span>{num ** 2}, </span>)}</p>

      <Search />

      <hr />

      <List list={stories} />

      <hr />
    </div>
  )
}


const List = (props) => {
  console.log('Rendering List')
  return (
    < ul >
      {props.list.map(item => (
        <Item key={item.objectID} item={item} />))}
    </ul >
  );
}

const Item = (props) => (
  <li>
    <a href={props.item.url}>{props.item.title}</a> - {props.item.author}
  </li>
)


const Search = () => {
  console.log('Rendering Search')

  const [searchTerm, setSearchTerm] = React.useState('');

  const handleChange = event => {
    setSearchTerm(event.target.value);
  }

  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" onChange={handleChange} />
      <p>Searching for: <strong>{searchTerm}</strong></p>
    </div>
  )
}

export default App
