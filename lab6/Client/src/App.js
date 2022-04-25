import React from 'react';
import './App.css';
import {Link, BrowserRouter as Router, Route} from 'react-router-dom';
import { useHistory } from "react-router-dom";
import Home from './components/Home';
import pokelist from './components/PokemonList';
import Pokemon from './components/Pokemon';
import Trainers from './components/Trainers';
// import My_posts from './components/My_posts';
// import New_post from './components/New_post';


function App() {
    const history = useHistory();

    function gotoList(e) {
        e.preventDefault();
        history.push("/pokemon/page/0");
    }
    function gotoTrainers(e) {
        e.preventDefault();
        history.push("/trainers");
    }
  return (
    <div>
        <header className='App-header'>
            <h1 className='App-title'>
                Binterest
            </h1>
            <nav>
                <button type='button' onClick={gotoList}>
                    Pokemon List
                </button>
                <button type='button' onClick={gotoTrainers}>
                    Trainers
                </button>
            </nav>
        </header>
        <div>
            <Route exact path='/' component={Home} />
            <Route exact path='/pokemon/page/:pagenum' component={pokelist} />
            <Route exact path='/pokemon/:id' component={Pokemon} />
            <Route exact path='/trainers' component={Trainers} />
        </div>
    </div>
  );
}

export default App;