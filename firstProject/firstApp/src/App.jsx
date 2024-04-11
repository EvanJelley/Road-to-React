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
  console.log('Rendering App');
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
    {
      title: 'Vue',
      url: 'https://vuejs.org/',
      author: 'Evan You',
      num_comments: 4,
      points: 5,
      objectID: 2,
    },
    {
      title: 'Angular',
      url: 'https://angular.io/',
      author: 'Google',
      num_comments: 1,
      points: 3,
      objectID: 3,
    },
    {
      title: 'Ember',
      url: 'https://emberjs.com/',
      author: 'Yehuda Katz',
      num_comments: 2,
      points: 4,
      objectID: 4,
    },
    {
      title: 'Svelte',
      url: 'https://svelte.dev/',
      author: 'Rich Harris',
      num_comments: 3,
      points: 5,
      objectID: 5,
    },
    {
      title: 'Next.js',
      url: 'https://nextjs.org/',
      author: 'Vercel',
      num_comments: 2,
      points: 4,
      objectID: 6,
    },
    {
      title: 'Gatsby',
      url: 'https://www.gatsbyjs.com/',
      author: 'Gatsby',
      num_comments: 3,
      points: 5,
      objectID: 7,
    },
    {
      title: 'Meteor',
      url: 'https://www.meteor.com/',
      author: 'Meteor Development Group',
      num_comments: 1,
      points: 3,
      objectID: 8,
    },
    {
      title: 'Django',
      url: 'https://www.djangoproject.com/',
      author: 'Django Software Foundation',
      num_comments: 2,
      points: 4,
      objectID: 9,
    },
    {
      title: 'Ruby on Rails',
      url: 'https://rubyonrails.org/',
      author: 'David Heinemeier Hansson',
      num_comments: 3,
      points: 5,
      objectID: 10,
    },
    {
      title: 'Express.js',
      url: 'https://expressjs.com/',
      author: 'TJ Holowaychuk',
      num_comments: 2,
      points: 4,
      objectID: 11,
    },
    {
      title: 'Flask',
      url: 'https://flask.palletsprojects.com/',
      author: 'Pallets Projects',
      num_comments: 3,
      points: 5,
      objectID: 12,
    },
    {
      title: 'Laravel',
      url: 'https://laravel.com/',
      author: 'Taylor Otwell',
      num_comments: 1,
      points: 3,
      objectID: 13,
    },
    {
      title: 'Spring Boot',
      url: 'https://spring.io/projects/spring-boot',
      author: 'Pivotal Software',
      num_comments: 2,
      points: 4,
      objectID: 14,
    },
    {
      title: 'ASP.NET',
      url: 'https://dotnet.microsoft.com/apps/aspnet',
      author: 'Microsoft',
      num_comments: 3,
      points: 5,
      objectID: 15,
    },
    {
      title: 'Flutter',
      url: 'https://flutter.dev/',
      author: 'Google',
      num_comments: 2,
      points: 4,
      objectID: 16,
    },
    {
      title: 'React Native',
      url: 'https://reactnative.dev/',
      author: 'Facebook',
      num_comments: 3,
      points: 5,
      objectID: 17,
    },
    {
      title: 'Ionic',
      url: 'https://ionicframework.com/',
      author: 'Ionic Team',
      num_comments: 1,
      points: 3,
      objectID: 18,
    },
    {
      title: 'Xamarin',
      url: 'https://dotnet.microsoft.com/apps/xamarin',
      author: 'Microsoft',
      num_comments: 2,
      points: 4,
      objectID: 19,
    },
    {
      title: 'Cordova',
      url: 'https://cordova.apache.org/',
      author: 'Apache',
      num_comments: 3,
      points: 5,
      objectID: 20,
    }
  ];

  const [searchTerm, setSearchTerm] = React.useState(localStorage.getItem('search') || 'React');

  React.useEffect(() => {
    localStorage.setItem('search', searchTerm)
  }, [searchTerm])

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter(story => 
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>{getGreeting(greeting, title)}</h1>
      <p>Here are some numbers: {(nums.map(num => <span>{num}, </span>))}</p>
      <p>Here they are squared: {nums.map(num => <span>{num ** 2}, </span>)}</p>

      <Search onSearch={handleSearch} searchTerm={searchTerm}/>

      <hr />

      <List list={searchedStories} />

      <hr />
    </div>
  )
}


const List = ({list}) => {
  console.log('Rendering List')
  return (
    < ul >
      {list.map(item => (
        <Item key={item.objectID} item={item} />))}
    </ul >
  );
}

const Item = ({item}) => (
  <li>
    <a href={item.url}>{item.title}</a> - {item.author}
  </li>
)


const Search = ({searchTerm, onSearch}) => {
  console.log('Rendering Search')

  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" onChange={onSearch} value={searchTerm}/>
    </div>
  )
}

export default App
