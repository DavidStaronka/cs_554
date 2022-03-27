import React from 'react';
import './App.css';
import CharList from './components/CharList';
import Char from './components/Char';
import Home from './components/Home';
import ComicList from './components/ComicList';
import Comic from './components/Comic';
import SeriesList from './components/SeriesList';
import Series from './components/Series';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

const App = () => {
	return (
		<Router>
			<div className='App'>
				<header className='App-header'>
					<h1 className='App-title'>Welcome to the React.js Marvel API app</h1>
					<Link className='showlink' to='/'>
						Home
					</Link>
					<Link className='showlink' to='/characters/page/0'>
						Characters
					</Link>
                    <Link className='showlink' to='/comics/page/0'>
						Comics
					</Link>
                    <Link className='showlink' to='/Series/page/0'>
						Series
					</Link>
				</header>
				<br />
				<br />
				<div className='App-body'>
					<Route exact path='/' component={Home} />
					<Route exact path='/characters/page/:page' component={CharList} />
					<Route exact path='/characters/:id' component={Char} />
                    <Route exact path='/comics/page/:page' component={ComicList} />
                    <Route exact path='/comics/:id' component={Comic} />
                    <Route exact path='/series/page/:page' component={SeriesList} />
                    <Route exact path='/series/:id' component={Series} />

				</div>
			</div>
		</Router>
	);
};

export default App;
