/* eslint-disable */

import * as React from 'react'
import './App.css'

function getGreeting(greeting, title) {
  return `${greeting} ${title}`
}

let nums = [1, 2, 3, 4, 5]

const greeting = 'Hello'
const title = 'World'

const list = [
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

function App() {
  return (
    <div>
      <h1>{getGreeting(greeting, title)}</h1>
      <p>Here are some numbers: {(nums.map(num => <span>{num}, </span>))}</p>
      <p>Here they are squared: {nums.map(num => <span>{num ** 2}, </span>)}</p>

      <Search />

      <hr />

      <List />

      <hr />
    </div>
  )
}

function List() {
  return (
    < ul >
      {
        list.map(item => (
          <li key={item.objectID}><a href={item.url}>{item.title}</a> - {item.author}</li>
        ))
      }
    </ul >
  );
};

function Search() {
  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" />
    </div>
  )
}
export default App
