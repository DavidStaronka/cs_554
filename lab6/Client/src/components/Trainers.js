import React, { useState, useEffect } from 'react';
import actions from '../actions';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import { Card, CardContent, CardMedia, Grid, Typography, makeStyles, Button } from '@material-ui/core';
import {v4 as uuid} from 'uuid';

const useStyles = makeStyles({});

const Trainers = (props) => {
    const classes = useStyles();
    const allTeams = useSelector((state) => state.teams);
    const active = useSelector((state) => state.active);
    const dispatch = useDispatch();

    let teamsList = null;

    function addTrainer(e) {
        e.preventDefault();
        dispatch(actions.addTeam());
        console.log(active)
        console.log("h")
    }

    function setActive(e) {
        e.preventDefault();
        // console.log("q")
        // console.log(e.target.id)
        dispatch(actions.setActiveTeam(parseInt(e.target.id)));
    }

    function removeTrainer(e) {
        e.preventDefault();
        dispatch(actions.removeTeam(parseInt(e.target.id)));
        // console.log(active.active)
        // console.log("h")
        // console.log(parseInt(e.target.id))
    }

    const buildCard = (pokemon) => {
        // can have duplicate pokemon, so I didn't really know how to get a unique key
        // Definitely a hack, but it works
        return (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={uuid()}>
                <Card className={classes.card} variant='outlined'>
                    <div>
                        <div onClick={() => { history.push(`/pokemon/${pokemon.id}`) }}>
                            <CardContent>
                                <Typography className={classes.titleHead} gutterBottom variant='h6' component='h3'>
                                    {pokemon.name}
                                </Typography>
                            </CardContent>

                            <CardMedia
                                className={classes.media}
                                component='img'
                                image={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                                title='image'
                            />
                        </div>
                    </div>
                </Card>
            </Grid>
        );
    };


    const buildTeam = (team) => {
        // console.log(team.id)
        // console.log("x")
        // console.log(active)
        if(team.id == active.active){
            return (
                <div key={team.id}>
                    <Grid container className={classes.grid}>
                        {team.pokemon.map((pokemon) => {
                            return buildCard(pokemon);
                        })}
                    </Grid>
                    <div className={classes.teamButtons}>
                        <button>Currently Active</button>
                        <button disabled>Remove</button>
                    </div>
                </div>
            );
        }
        return (
            <div key={team.id}>
                <Grid container className={classes.grid}>
                    {team.pokemon.map((pokemon) => {
                        return buildCard(pokemon);
                    })}
                </Grid>
                <div className={classes.teamButtons}>
                    <button id={team.id} onClick={setActive}>Set Active</button>
                    <button id={team.id} onClick={removeTrainer}>Remove</button>
                </div>
            </div>
        );
    };

    teamsList = 
        allTeams &&
        allTeams.map((team) => {        
            return buildTeam(team);
        });
    
    return (
        <div>
            {teamsList}
            <div>
                <button onClick={addTrainer}>Add Team</button>
            </div>
        </div>
    );
}


export default Trainers;