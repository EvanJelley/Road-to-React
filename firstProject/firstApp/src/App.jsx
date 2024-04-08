import * as React from 'react'
import './App.css'

function getGreeting(greeting, title) {
  return `${greeting} ${title}`
}

let nums = [1, 2, 3, 4, 5]

const greeting = 'Hello'
const title = 'World'

function App() {
  return (
    <div>
      <h1>{getGreeting(greeting, title)}</h1>
      <p>Here are some numbers: {nums.map(num => <span>{num}, </span>)}</p>
      <p>Here they are squared: {nums.map(num => <span>{num**2}, </span>)}</p>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" />
    </div>
  )
}

export default App
