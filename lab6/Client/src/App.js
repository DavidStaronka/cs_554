import React from 'react';
import './App.css';
import {NavLink, BrowserRouter as Router, Route} from 'react-router-dom';
import Home from './components/Home';
import pokelist from './components/PokemonList';
// import My_posts from './components/My_posts';
// import New_post from './components/New_post';


function App() {
  return (
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
            <div>
                <Route exact path='/' component={Home} />
                <Route path='/pokemon/page/:pagenum' component={pokelist} />
                {/* <Route path='/pokemon/:id' component={My_posts} />
                <Route path='/trainers' component={New_post} /> */}
            </div>
        </div>
    </Router>
  );
}

export default App;