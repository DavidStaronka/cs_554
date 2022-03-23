import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SearchShows from './SearchShows';
import noImage from '../img/download.jpeg';
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography, makeStyles } from '@material-ui/core';

import '../App.css';
const useStyles = makeStyles({
	card: {
		maxWidth: 250,
		height: 'auto',
		marginLeft: 'auto',
		marginRight: 'auto',
		borderRadius: 5,
		border: '1px solid #1e8678',
		boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
	},
	titleHead: {
		borderBottom: '1px solid #1e8678',
		fontWeight: 'bold'
	},
	grid: {
		flexGrow: 1,
		flexDirection: 'row'
	},
	media: {
		height: '100%',
		width: '100%'
	},
	button: {
		color: '#1e8678',
		fontWeight: 'bold',
		fontSize: 12
	}
});
const ShowList = (props) => {
	const regex = /(<([^>]+)>)/gi;
	const classes = useStyles();
    const [ error404, setError404 ] = useState(false);
    const [ nextPage, setNextPage ] = useState(true);
	const [ loading, setLoading ] = useState(true);
	const [ searchData, setSearchData ] = useState(undefined);
	const [ showsData, setShowsData ] = useState(undefined);
	const [ searchTerm, setSearchTerm ] = useState('');
	let card = null;
 
	useEffect(() => {
		console.log('on load useeffect');
		async function fetchData() {
            if(!props.match.params.page){
                try {
                    const { data } = await axios.get('http://api.tvmaze.com/shows');
                    setShowsData(data);
                    setLoading(false);
                } catch (e) {
                    console.log(e);
                }
            }
        }
		fetchData();
	}, []);

    useEffect(() => {
        console.log('load with page param')
        async function fetchData() {
            if(props.match.params.page){
                try{
                    let url = `https://api.tvmaze.com/shows?page=${props.match.params.page}`;
                    let shows = await axios.get(url);
                    setShowsData(shows.data);
                    setLoading(false);
                }catch(error){
                    console.log(error);
                    setError404(true);
                }
                try{
                    let url = `https://api.tvmaze.com/shows?page=${parseInt(props.match.params.page) + 1}`;
                    let shows = await axios.get(url);
                    setNextPage(true);
                } catch(error){
                    setNextPage(false);
                }
            }
        }
        fetchData();
    }, [props.match.params.page]);

	useEffect(
		() => {
			console.log('search useEffect fired');
			async function fetchData() {
				try {
					console.log(`in fetch searchTerm: ${searchTerm}`);
					const { data } = await axios.get('http://api.tvmaze.com/search/shows?q=' + searchTerm);
					setSearchData(data);
					setLoading(false);
				} catch (e) {
					console.log(e);
				}
			}
			if (searchTerm) {
				console.log ('searchTerm is set')
				fetchData();
			}
		},
		[ searchTerm ]
	);



	const searchValue = async (value) => {
		setSearchTerm(value);
	};
	const buildCard = (show) => {
		return (
			<Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={show.id}>
				<Card className={classes.card} variant='outlined'>
					<CardActionArea>
						<Link to={`/shows/${show.id}`}>
							<CardMedia
								className={classes.media}
								component='img'
								image={show.image && show.image.original ? show.image.original : noImage}
								title='show image'
							/>

							<CardContent>
								<Typography className={classes.titleHead} gutterBottom variant='h6' component='h3'>
									{show.name}
								</Typography>
								<Typography variant='body2' color='textSecondary' component='p'>
									{show.summary ? show.summary.replace(regex, '').substring(0, 139) + '...' : 'No Summary'}
									<span>More Info</span>
								</Typography>
							</CardContent>
						</Link>
					</CardActionArea>
				</Card>
			</Grid>
		);
	};

	if (searchTerm) {
		card =
			searchData &&
			searchData.map((shows) => {
				let { show } = shows;
				return buildCard(show);
			});
	} else {
		card =
			showsData &&
			showsData.map((show) => {
				return buildCard(show);
			});
	}

    if (error404){
        return (
			<div>
				<h2>Couldn't find any shows on this page, maybe try another</h2>
			</div>
		);
    }

	if (loading) {
		return (
			<div>
				<h2>Loading....</h2>
			</div>
		);
	} else {
        if(!props.match.params.page || props.match.params.page === '0'){
            return (
                <div>
                    <SearchShows searchValue={searchValue} />
                    <br />
                    <br />
                    <Grid container className={classes.grid} spacing={5}>
                        {card}
                    </Grid>
                    <Link to={'/shows/page/1'}>
                        <h2>Next</h2>
                    </Link>
                </div>
            );
        }else{
            if(nextPage){
                return (
                    <div>
                        <SearchShows searchValue={searchValue} />
                        <br />
                        <br />
                        <Grid container className={classes.grid} spacing={5}>
                            {card}
                        </Grid>
                        <Link to={`/shows/page/${parseInt(props.match.params.page)-1}`}>
                            <h2 className={classes.button}>Previous</h2>
                        </Link>
                        <Link to={`/shows/page/${parseInt(props.match.params.page)+1}`}>
                            <h2 className={classes.button}>Next</h2>
                        </Link>
                    </div>
                );
            }else{
                return (
                    <div>
                        <SearchShows searchValue={searchValue} />
                        <br />
                        <br />
                        <Grid container className={classes.grid} spacing={5}>
                            {card}
                        </Grid>
                        <Link to={`/shows/page/${parseInt(props.match.params.page)-1}`}>
                            <h2 className={classes.button}>Previous</h2>
                        </Link>
                    </div>
                );
            }
        }
	}
};

export default ShowList;
