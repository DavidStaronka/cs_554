import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Grid, Typography, makeStyles, Button } from '@material-ui/core';
import { useMutation } from '@apollo/client';
import queries from '../queries';
// import { Link } from 'react-router-dom';

const useStyles = makeStyles({});

const Common = (props) => {
    const [ images, setImages ] = useState([]);
    const [ changeInBack, setChangeInBack ] = useState(false);
    // const [ loading, setLoading ] = useState(true);
    // const [ error, setError ] = useState(false);
	const classes = useStyles();

    let card = null;

    const [binHandler, {binData, binLoading, binError}] = useMutation(queries.UPDATE_IMAGE);
    const [deleteHandler, {delData, delLoading, delError}] = useMutation(queries.DELETE_IMAGE);
   
    useEffect(() => {
        // need a wrapper component to fetch data from backend
        setImages(props.images);
    }, [props.images]);


    if(binError){
        console.log(binError);
    }
    if(delError){
        console.log(delError);
    }

    

    // TODO: have add to bin/remove from bin call backend
    const buildCard = (picture) => {
        console.log(picture);
        if(!props.my_posts){
            if(!picture.binned){
                return (
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={picture.id}>
                        <Card className={classes.card} variant='outlined'>
                            <div>
                                <CardContent>
                                    <Typography color='textPrimary' component='p'>
                                        {picture.description}
                                    </Typography>
                                    <Typography color='textPrimary' component='p'>
                                        {'an image by: ' + picture.posterName}
                                    </Typography>
                                </CardContent>

                                <CardMedia
                                    className={classes.media}
                                    component='img'
                                    image={picture.url ? picture.url : noImage}
                                    title='image'
                                />
                                <div>
                                    <Button size='small' onClick={() => {
                                        binHandler({ variables: { 
                                            updateImageId: picture.id, 
                                            url:picture.url, 
                                            posterName: picture.posterName, 
                                            description: picture.description, 
                                            userPosted: picture.userPosted, 
                                            binned: true 
                                        } })
                                        setChangeInBack(true);
                                    }
                                    }>add to bin</Button>
                                </div>
                            </div>
                        </Card>
                    </Grid>
                );
            } else {
                return (
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={picture.id}>
                        <Card className={classes.card} variant='outlined'>
                            <div>
                                <CardContent>
                                    <Typography color='textPrimary' component='p'>
                                        {picture.description}
                                    </Typography>
                                    <Typography color='textPrimary' component='p'>
                                        {'an image by: ' + picture.posterName}
                                    </Typography>
                                </CardContent>

                                <CardMedia
                                    className={classes.media}
                                    component='img'
                                    image={picture.url ? picture.url : noImage}
                                    title='image'
                                />
                                <div>
                                    <Button size='small' onClick={() => {
                                        binHandler({ variables: { 
                                            updateImageId: picture.id, 
                                            url:picture.url, 
                                            posterName: picture.posterName, 
                                            description: picture.description, 
                                            userPosted: picture.userPosted, 
                                            binned: false 
                                        } })
                                        setChangeInBack(true);
                                    }
                                    }>remove from bin</Button>
                                </div>
                            </div>
                        </Card>
                    </Grid>
                );
            }
        } else {
            if(!picture.binned){
                return (
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={picture.id}>
                        <Card className={classes.card} variant='outlined'>
                            <div>
                                <CardContent>
                                    <Typography color='textPrimary' component='p'>
                                        {picture.description}
                                    </Typography>
                                    <Typography color='textPrimary' component='p'>
                                        {'an image by: ' + picture.posterName}
                                    </Typography>
                                </CardContent>

                                <CardMedia
                                    className={classes.media}
                                    component='img'
                                    image={picture.url ? picture.url : noImage}
                                    title='image'
                                />
                                <div>
                                    <Button size='small' onClick={() => {
                                        binHandler({ variables: { 
                                            updateImageId: picture.id, 
                                            url:picture.url, 
                                            posterName: picture.posterName, 
                                            description: picture.description, 
                                            userPosted: picture.userPosted, 
                                            binned: true 
                                        } })
                                        setChangeInBack(true);}
                                    }>add to bin</Button>
                                    <Button size='small' onClick={() => {
                                        deleteHandler({ variables: { deleteImageId: picture.id} })
                                        setChangeInBack(true); }
                                    }>delete</Button>
                                </div>
                            </div>
                        </Card>
                    </Grid>
                );
            } else {
                return (
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={picture.id}>
                        <Card className={classes.card} variant='outlined'>
                            <div>
                                <CardContent>
                                    <Typography color='textPrimary' component='p'>
                                        {picture.description}
                                    </Typography>
                                    <Typography color='textPrimary' component='p'>
                                        {'an image by: ' + picture.posterName}
                                    </Typography>
                                </CardContent>

                                <CardMedia
                                    className={classes.media}
                                    component='img'
                                    image={picture.url ? picture.url : noImage}
                                    title='image'
                                />
                                <div>
                                    <Button size='small' onClick={() => {
                                        binHandler({ variables: { 
                                            updateImageId: picture.id, 
                                            binned: false 
                                        } })
                                        setChangeInBack(true); }
                                    }>remove from bin</Button>
                                    <Button size='small' onClick={() => {
                                        deleteHandler({ variables: { deleteImageId: picture.id} })
                                        setChangeInBack(true); }
                                    }>delete</Button>
                                </div>
                            </div>
                        </Card>
                    </Grid>
                );
            }
        }
	};

    // build grid with backend data map (like charList)
    card =
        images &&
        images.map((image) => {
            return buildCard(image);
        });

    if(binLoading){
        return <p>Adding to Bin</p>;
    }
    if(delLoading){
        return <p>Removing from Bin</p>;
    }

    if(changeInBack){
        setChangeInBack(false);
        if(binLoading){
            return <p>Adding to Bin</p>;
        }
        if(delLoading){
            return <p>Removing from Bin</p>;
        }
    }

    return (
        <Grid container className={classes.grid} spacing={5}>
            {card}
        </Grid>
    );
}

export default Common;
