import React from 'react';
import '../App.css';
import { useHistory } from "react-router-dom";


const Home = () => {
    const history = useHistory();

    function gotoList(e) {
        e.preventDefault();
        history.push("/pokemon/page/0");
    }
    
	return (
		<div>
			<p>
				This is a web app that uses the pokemon API to let you assemble teams of pokemon as different trainers.
                Go to pokemon to find one to catch, and to trainers to create and swap between your teams.
			</p>
		</div>
	);
};

export default Home;