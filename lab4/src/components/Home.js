import React from 'react';
import '../App.css';

const Home = () => {
	return (
		<div>
			<p>
				This is a simple example of using React to Query the Marvel API. To get started, click one of the buttons above.
			</p>

			<p className='hometext'>
				The application queries the following Marvel API end-points:{' '}
				<a rel='noopener noreferrer' target='_blank' href='http://gateway.marvel.com:443/v1/public/characters'>
                    http://gateway.marvel.com:443/v1/public/characters
				</a>
				,{' '}
				<a rel='noopener noreferrer' target='_blank' href='http://gateway.marvel.com:443/v1/public/comics'>
                    http://gateway.marvel.com:443/v1/public/comics
				</a>
                , and{' '}
				<a rel='noopener noreferrer' target='_blank' href='http://gateway.marvel.com:443/v1/public/series'>
                    http://gateway.marvel.com:443/v1/public/series
				</a>{' '}
				To find characters, comics, and series respectively. You can use the search bar on each page to search for a specific character, comic, or series depending on which page you're on.
			</p>
		</div>
	);
};

export default Home;
