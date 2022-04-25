import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, CardHeader, Typography, makeStyles, Button } from '@material-ui/core';
import actions from '../actions';
import {useSelector} from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {useDispatch} from 'react-redux';

const useStyles = makeStyles({});

const Pokemon = (props) => {
    const [ pokeData, setPokeData ] = useState(undefined);
	const [ loading, setLoading ] = useState(true);
    const [ error404, setError404 ] = useState(false);
    const [ activeTeam, setActiveTeam ] = useState([]);
	const classes = useStyles();

    const allTeams = useSelector((state) => state.teams);
    const active = useSelector((state) => state.active);

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/pokemon/${props.match.params.id}`);
                setPokeData(response.data);
                let index = allTeams.findIndex(x => x.id == active.active);
                setActiveTeam(allTeams[index].pokemon);
                console.log("z");
                setLoading(false);
            } catch (error) {
                console.log(error);
                setError404(true);
            }
        };
        if(loading){
            fetchData();
        }
    }, [props.match.params.id]);



    if (loading) {
		return (
			<div>
				<h2>Loading....</h2>
			</div>
		);
	} else if (error404) {
        return (
            <div>
                <h2>404: No pokemon found with that ID.</h2>
            </div>
        );
    } else {
        console.log(activeTeam.length);
        if(activeTeam.length > 0){
            for(let poke of activeTeam){
                if(poke.id == `${pokeData.id}`){
                    if(activeTeam.length < 6){
                        return (
                            <Card className={classes.card} variant='outlined'>
                                <CardHeader className={classes.titleHead} title={pokeData.name} />
                                <CardMedia 
                                    className={classes.media}
                                    component='img'
                                    image={pokeData.sprites.other['official-artwork'].front_default}
                                    title='Official Artwork'
                                />
                                <CardContent>
                                    <Typography variant='body2' color='textSecondary' component='span'>
                                        <dl>
                                            <p>
                                                <dt className='title'>Height:</dt>
                                                <dd>{pokeData.height}</dd>
                                            </p>
                                            <p>
                                                <dt className='title'>Weight:</dt>
                                                <dd>{pokeData.weight}</dd>
                                            </p>
                                            <p>
                                                <dt className='title'>Abilities:</dt>
                                                <dd>{pokeData.abilities.map(ability => ability.ability.name).join(', ')}</dd>
                                            </p>
                                        </dl>
                                    </Typography>
                                    <div>
                                        <Button size='small' onClick={() => {
                                            console.log({name: pokeData.name, id: `${pokeData.id}`});
                                            dispatch(actions.removePokemonFromTeam({name: pokeData.name, id: `${pokeData.id}`}, active.active));
                                            let newTeam = [...activeTeam];
                                            let index = newTeam.findIndex(x => x.id == `${pokeData.id}`);
                                            newTeam.splice(index, 1);
                                            setActiveTeam(newTeam);
                                        }}>Release</Button>
                                        <Button size='small' onClick={() => {
                                            dispatch(actions.addPokemonToTeam({name: pokeData.name, id: `${pokeData.id}`}, active.active));
                                            if(activeTeam.length > 0){
                                                setActiveTeam([...activeTeam, {name: pokeData.name, id: `${pokeData.id}`}]);
                                            }else{
                                                setActiveTeam([{name: pokeData.name, id: `${pokeData.id}`}]);
                                            }
                                        }}>Catch</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    }else{
                        return (
                            <Card className={classes.card} variant='outlined'>
                                <CardHeader className={classes.titleHead} title={pokeData.name} />
                                <CardMedia 
                                    className={classes.media}
                                    component='img'
                                    image={pokeData.sprites.other['official-artwork'].front_default}
                                    title='Official Artwork'
                                />
                                <CardContent>
                                    <Typography variant='body2' color='textSecondary' component='span'>
                                        <dl>
                                            <p>
                                                <dt className='title'>Height:</dt>
                                                <dd>{pokeData.height}</dd>
                                            </p>
                                            <p>
                                                <dt className='title'>Weight:</dt>
                                                <dd>{pokeData.weight}</dd>
                                            </p>
                                            <p>
                                                <dt className='title'>Abilities:</dt>
                                                <dd>{pokeData.abilities.map(ability => ability.ability.name).join(', ')}</dd>
                                            </p>
                                        </dl>
                                    </Typography>
                                    <div>
                                        <Button size='small' onClick={() => {
                                            dispatch(actions.removePokemonFromTeam({name: pokeData.name, id: `${pokeData.id}`}, active.active));
                                            let newTeam = [...activeTeam];
                                            let index = newTeam.findIndex(x => x.id == `${pokeData.id}`);
                                            newTeam.splice(index, 1);
                                            setActiveTeam(newTeam);
                                        }}>Release</Button>
                                        <Button size='small'>Team full</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    }
                }
            }
        }
        console.log(activeTeam);
        if(activeTeam.length < 6){
            return (
                <Card className={classes.card} variant='outlined'>
                    <CardHeader className={classes.titleHead} title={pokeData.name} />
                    <CardMedia 
                        className={classes.media}
                        component='img'
                        image={pokeData.sprites.other['official-artwork'].front_default}
                        title='Official Artwork'
                    />
                    <CardContent>
                        <Typography variant='body2' color='textSecondary' component='span'>
                            <dl>
                                <p>
                                    <dt className='title'>Height:</dt>
                                    <dd>{pokeData.height}</dd>
                                </p>
                                <p>
                                    <dt className='title'>Weight:</dt>
                                    <dd>{pokeData.weight}</dd>
                                </p>
                                <p>
                                    <dt className='title'>Abilities:</dt>
                                    <dd>{pokeData.abilities.map(ability => ability.ability.name).join(', ')}</dd>
                                </p>
                            </dl>
                        </Typography>
                        <div>
                            <Button size='small' onClick={() => {
                                dispatch(actions.addPokemonToTeam({name: pokeData.name, id: `${pokeData.id}`}, active.active));
                                if(activeTeam.length > 0){
                                    setActiveTeam([...activeTeam, {name: pokeData.name, id: `${pokeData.id}`}]);
                                }else{
                                    setActiveTeam([{name: pokeData.name, id: `${pokeData.id}`}]);
                                }
                            }}>Catch</Button>
                        </div>
                    </CardContent>
                </Card>
            );
        }
        // console.log(activeTeam)
        return (
            <Card className={classes.card} variant='outlined'>
                <CardHeader className={classes.titleHead} title={pokeData.name} />
                <CardMedia 
                    className={classes.media}
                    component='img'
                    image={pokeData.sprites.other['official-artwork'].front_default}
                    title='Official Artwork'
                />
                <CardContent>
                    <Typography variant='body2' color='textSecondary' component='span'>
                        <dl>
                            <p>
                                <dt className='title'>Height:</dt>
                                <dd>{pokeData.height}</dd>
                            </p>
                            <p>
                                <dt className='title'>Weight:</dt>
                                <dd>{pokeData.weight}</dd>
                            </p>
                            <p>
                                <dt className='title'>Abilities:</dt>
                                <dd>{pokeData.abilities.map(ability => ability.ability.name).join(', ')}</dd>
                            </p>
                        </dl>
                    </Typography>
                    <div>
                        <Button size='small'>Team full</Button>
                    </div>
                </CardContent>
            </Card>
        );
    }                  
}

export default Pokemon;