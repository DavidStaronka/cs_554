import React from 'react';
// import './App.css';
import {NavLink, BrowserRouter as Router, Route} from 'react-router-dom';
import Unsplash_imgs from './components/Unsplash_imgs';
import My_bin from './components/My_bin';
import My_posts from './components/My_posts';
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider
} from '@apollo/client';
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000'
  })
});

function App() {
  return (
    <ApolloProvider client={client}>
        <Router>
            <div>
                <header className='App-header'>
                    <h1 className='App-title'>
                        Binterest
                    </h1>
                    <nav>
                    <NavLink className='navlink' to='/my-bin'>
                        my bin
                    </NavLink>
                    <NavLink className='navlink' to='/'>
                        images
                    </NavLink>

                    <NavLink className='navlink' to='/my-posts'>
                        my posts
                    </NavLink>
                    </nav>
                </header>
                <Route exact path='/' component={Unsplash_imgs} />
                <Route path='/my-bin' component={My_bin} />
                <Route path='/my-posts' component={My_posts} />
            </div>
        </Router>
    </ApolloProvider>
  );
}

export default App;