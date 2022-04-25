import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Grid, Typography, makeStyles, Button } from '@material-ui/core';
import actions from '../actions';
import {useSelector} from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {useDispatch} from 'react-redux';
import { useHistory } from "react-router-dom";
import ReactPaginate from 'react-paginate';
// import { Link } from 'react-router-dom';

const useStyles = makeStyles({
    page: {
        display: 'inline-block',
        paddingLeft: 0,
        listStyle: 'none'
    },
    pageLink: {
        position: 'relative',
        justify: 'center',
        float: 'left',
        padding: '6px 12px'
    },
    activeLink: {
        backgroundColor: '#b9c4d4'
    }
});

const PokemonList = (props) => {
    const [ pokemon, setpokemon ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState(false);
    const [ total, settotal ] = useState(0);
    const [ page, setPage ] = useState(0);
    const [ firstLoad, setFirstLoad ] = useState(true);
    const [ activeTeam, setActiveTeam ] = useState([]);
    // const [ loading, setLoading ] = useState(true);
    // const [ error, setError ] = useState(false);
	const classes = useStyles();

    const allTeams = useSelector((state) => state.teams);
    const active = useSelector((state) => state.active);
    // console.log(allTeams);

    let card = null;
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        async function fetchData() {
            try{
                // console.log(props.match.params.pagenum);
                let url = 'http://localhost:5000/pokemon/page/' + props.match.params.pagenum;
                // console.log(url);
                let pokeList = await axios.get(url);
                // console.log(pokeList.data);
                setpokemon(pokeList.data.results);
                let index = allTeams.findIndex(x => x.id == active.active);
                // console.log(index);
                // console.log(allTeams[index]);
                setActiveTeam(allTeams[index].pokemon);
                settotal(Math.ceil(pokeList.data.count / 20));
                setPage(parseInt(props.match.params.pagenum));  
                // console.log(activeTeam); 
                setLoading(false);
                setFirstLoad(false);
            }catch(error){
                console.log(error);
                setError(true);
            }
        }
        if(firstLoad){
            fetchData();
        }
    }, [props.match.params.pagenum]);

    useEffect(() => {
        async function fetchData() {
            try{
                let url = 'http://localhost:5000/pokemon/page/' + page;
                let pokeList = await axios.get(url);
                // console.log(pokeList);
                setpokemon(pokeList.data.results);
                setLoading(false);
            }catch(error){
                // console.log(error);
                setError(true);
            }
        }
            
        if(!firstLoad){
            fetchData();
        }
    }, [page]);

    const handlePageClick = (event) => {
        const newOffset = event.selected;
        // console.log(`newOffset: ${newOffset}`);
        // console.log(`event.selected: ${event.selected}`);
        // console.log(`pageCount: ${pageCount}`);
        // console.log(`cardsPerPage: ${cardsPerPage}`);
        setLoading(true);
        setPage(newOffset);
    }


    const buildCard = (pokeman) => {
        let id = pokeman.url.split('/')[6];
        // console.log(id)
        if(activeTeam.length > 0){
            for (let poke of activeTeam){
                // console.log(id);
                if(poke.id == id){
                    // console.log("XXXX");
                    if(activeTeam.length < 6){
                        return (
                            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={id}>
                                <Card className={classes.card} variant='outlined'>
                                    <div>
                                        <div onClick={() => { history.push(`/pokemon/${id}`) }}>
                                            <CardContent>
                                                <Typography className={classes.titleHead} gutterBottom variant='h6' component='h3'>
                                                    {pokeman.name}
                                                </Typography>
                                            </CardContent>

                                            <CardMedia
                                                className={classes.media}
                                                component='img'
                                                image={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
                                                title='image'
                                            />
                                        </div>
                                        <div>
                                            <Button size='small' onClick={() => {
                                                dispatch(actions.removePokemonFromTeam({name: pokeman.name, id: id}, active.active));
                                                let newTeam = [...activeTeam];
                                                let index = newTeam.findIndex(x => x.id == id);
                                                newTeam.splice(index, 1);
                                                setActiveTeam(newTeam);
                                            }}>Release</Button>
                                            <Button size='small' onClick={() => {
                                                dispatch(actions.addPokemonToTeam({name: pokeman.name, id: id}, active.active));
                                                if(activeTeam.length > 0){
                                                    setActiveTeam([...activeTeam, {name: pokeman.name, id: id}]);
                                                }else{
                                                    setActiveTeam([{name: pokeman.name, id: id}]);
                                                }
                                            }}>Catch</Button>
                                        </div>
                                    </div>
                                </Card>
                            </Grid>
                        );
                    } else {
                        return (
                            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={id}>
                                <Card className={classes.card} variant='outlined'>
                                    <div>
                                        <div onClick={() => { history.push(`/pokemon/${id}`) }}>
                                            <CardContent>
                                                <Typography className={classes.titleHead} gutterBottom variant='h6' component='h3'>
                                                    {pokeman.name}
                                                </Typography>
                                            </CardContent>

                                            <CardMedia
                                                className={classes.media}
                                                component='img'
                                                image={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
                                                title='image'
                                            />
                                        </div>
                                        <div>
                                            <Button size='small' onClick={() => {
                                                dispatch(actions.removePokemonFromTeam({name: pokeman.name, id: id}, active.active));
                                                let newTeam = [...activeTeam];
                                                let index = newTeam.findIndex(x => x.id == id);
                                                newTeam.splice(index, 1);
                                                setActiveTeam(newTeam);
                                            }}>Release</Button>
                                            <Button size='small' >Team full</Button>
                                        </div>
                                    </div>
                                </Card>
                            </Grid>
                        );
                    }
                }
            }
        } 
        console.log(activeTeam);
        if(activeTeam.length >= 6){
            return (
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={id}>
                    <Card className={classes.card} variant='outlined'>
                        
                        <div>
                            <div onClick={() => { history.push(`/pokemon/${id}`) }}>
                                <CardContent>
                                    <Typography className={classes.titleHead} gutterBottom variant='h6' component='h3'>
                                        {pokeman.name}
                                    </Typography>
                                </CardContent>

                                <CardMedia
                                    className={classes.media}
                                    component='img'
                                    image={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
                                    title='image'
                                />
                            </div>
                            <div>
                                <Button size='small' >Team full</Button>
                            </div>
                        </div>
                        
                    </Card>
                </Grid>
            );
        }

        return (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={id}>
                <Card className={classes.card} variant='outlined'>
                    
                    <div>
                        <div onClick={() => { history.push(`/pokemon/${id}`) }}>
                            <CardContent>
                                <Typography className={classes.titleHead} gutterBottom variant='h6' component='h3'>
                                    {pokeman.name}
                                </Typography>
                            </CardContent>

                            <CardMedia
                                className={classes.media}
                                component='img'
                                image={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
                                title='image'
                            />
                        </div>
                        <div>
                            <Button size='small' onClick={() => {
                                dispatch(actions.addPokemonToTeam({name: pokeman.name, id: id}, active.active));
                                if(activeTeam.length > 0){
                                    setActiveTeam([...activeTeam, {name: pokeman.name, id: id}]);
                                }else{
                                    setActiveTeam([{name: pokeman.name, id: id}]);
                                }
                            }}>Catch</Button>
                        </div>
                    </div>
                    
                </Card>
            </Grid>
        );
    };

    // build grid with backend data map (like charList)
    card =
        pokemon &&
        pokemon.map((poke) => {
            return buildCard(poke);
        });

        
    if (error){
        return (
			<div>
                <h1>Error 404:</h1>
				<h2>Couldn't find any pokemon on this page, maybe try another</h2>
			</div>
		);
    }

	if (loading) {
		return (
			<div>
				<h2>Loading....</h2>
			</div>
		);
    }

    if(page == 0){
        return (
            <div>
                <Grid container className={classes.grid} spacing={5}>
                    {card}
                </Grid>
                <ReactPaginate
                    containerClassName={classes.pagination}
                    pageClassName={classes.page}
                    pageLinkClassName={classes.pageLink}
                    activeLinkClassName={classes.activeLink}
                    forcePage={page}
                    breakLabel="..."
                    nextLabel="next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={total}
                    previousLabel=""
                />
            </div>
        );
    }else if(page == total-1){
        return (
            <div>
                <Grid container className={classes.grid} spacing={5}>
                    {card}
                </Grid>
                <ReactPaginate
                    containerClassName={classes.pagination}
                    pageClassName={classes.page}
                    pageLinkClassName={classes.pageLink}
                    activeLinkClassName={classes.activeLink}
                    forcePage={page}
                    breakLabel="..."
                    nextLabel=""
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={total}
                    previousLabel="< prev"
                />
            </div>
        );
    }else{
        return (
            <div>
                <Grid container className={classes.grid} spacing={5}>
                    {card}
                </Grid>
                <ReactPaginate
                    containerClassName={classes.pagination}
                    pageClassName={classes.page}
                    pageLinkClassName={classes.pageLink}
                    activeLinkClassName={classes.activeLink}
                    forcePage={page}
                    breakLabel="..."
                    nextLabel="next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={total}
                    previousLabel="< prev"
                />
            </div>
        );
    }

}

export default PokemonList;
