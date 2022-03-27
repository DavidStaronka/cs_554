import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Search from './Search';
import noImage from '../img/download.jpeg';
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography, makeStyles } from '@material-ui/core';
import ReactPaginate from 'react-paginate';
import md5 from 'blueimp-md5';

import '../App.css';

const cardsPerPage = 25;
const publickey = 'a929b3cec4ce202cbd929a563541589a';
const privatekey = 'a0643c86dcceb3551471c50f1cfd2220b46a4e14';

const useStyles = makeStyles({
	card: {
		maxWidth: 250,
		height: 'auto',
		marginLeft: 'auto',
		marginRight: 'auto',
		borderRadius: 5,
		border: '1px solid #178577',
		boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
	},
	titleHead: {
		borderBottom: '1px solid #178577',
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
		color: '#178577',
		fontWeight: 'bold',
		fontSize: 12
	},
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
        backgroundColor: '#000000'
    }
});
const ComicList = (props) => {
	const regex = /(<([^>]+)>)/gi;
	const classes = useStyles();
    const [ error404, setError404 ] = useState(false);
	const [ loading, setLoading ] = useState(true);
	const [ searchData, setSearchData ] = useState(undefined);
	const [ searchTerm, setSearchTerm ] = useState('');

    const [currentItems, setCurrentItems] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const [firstLoad, setFirstLoad] = useState(true);

	let card = null;

    useEffect(() => {
        console.log('load with page param')
        async function fetchData() {
            try{
                const ts = new Date().getTime();
                const stringToHash = ts + privatekey + publickey;
                const hash = md5(stringToHash);
                const baseUrl = 'https://gateway.marvel.com:443/v1/public/comics';
                const url = baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash + '&offset=' + props.match.params.page + '&limit=' + cardsPerPage;
                const data = await axios.get(url);
                console.log(data.data.data.results)

                if(data.data.data.results.length === 0){
                    setError404(true);
                    return;
                }

                setItemOffset(props.match.params.page*25);
                setCurrentItems(data.data.data.results);
                setPageCount(Math.ceil(data.data.data.total/cardsPerPage));
                setFirstLoad(false);
                setLoading(false);
            }catch(error){
                console.log(error);
                setError404(true);
            }
        }
        if(firstLoad){
            fetchData();
        }
    }, [props.match.params.page, firstLoad]);

    useEffect(() => {
        async function fetchData() {
            console.log(itemOffset);
            const ts = new Date().getTime();
            const stringToHash = ts + privatekey + publickey;
            const hash = md5(stringToHash);
            const baseUrl = 'https://gateway.marvel.com:443/v1/public/comics';
            const url = baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash + '&offset=' + itemOffset + '&limit=' + cardsPerPage;
            const data = await axios.get(url);
            console.log(data.data.data.results[0].description)

            setCurrentItems(data.data.data.results);
            setPageCount(Math.ceil(data.data.data.total/cardsPerPage));
            setLoading(false);
        }
        if(!firstLoad){
            fetchData();
        }
    }, [itemOffset, firstLoad]);


	useEffect(
		() => {
			console.log('search useEffect fired');
			async function fetchData() {
				try {
                    const ts = new Date().getTime();
                    const stringToHash = ts + privatekey + publickey;
                    const hash = md5(stringToHash);
                    const baseUrl = 'https://gateway.marvel.com:443/v1/public/comics';
                    const url = baseUrl + '?titleStartsWith=' + searchTerm + '&ts=' + ts + '&apikey=' + publickey + '&hash=' + hash + '&limit=' + cardsPerPage;
                    const data = await axios.get(url);


					setSearchData(data.data.data.results);
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

    const handlePageClick = (event) => {
        const newOffset = (event.selected * cardsPerPage);
        // console.log(`newOffset: ${newOffset}`);
        // console.log(`event.selected: ${event.selected}`);
        // console.log(`pageCount: ${pageCount}`);
        // console.log(`cardsPerPage: ${cardsPerPage}`);
        setLoading(true);
        setItemOffset(newOffset);
    }

	const searchValue = async (value) => {
		setSearchTerm(value);
	};
	
    const buildCard = (comic) => {
		return (
			<Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={comic.id}>
				<Card className={classes.card} variant='outlined'>
					<CardActionArea>
						<Link to={`/comics/${comic.id}`}>
							<CardMedia
								className={classes.media}
								component='img'
								image={comic.thumbnail.path ? comic.thumbnail.path + "/portrait_xlarge." + comic.thumbnail.extension : noImage}
								title='comic image'
							/>

							<CardContent>
								<Typography className={classes.titleHead} gutterBottom variant='h6' component='h3'>
									{comic.title}
								</Typography>
								<Typography variant='body2' color='textSecondary' component='p'>
									{comic.description !== "" ? comic.description.replace(regex, '').substring(0, 139) + '...' : 'No Description'}
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
			searchData.map((comic) => {
                if(!comic.description){
                    comic.description = '';
                }
				return buildCard(comic);
			});
	} else {
		card =
            currentItems &&
            currentItems.map((comic) => {
                if(!comic.description){
                    comic.description = '';
                }
				return buildCard(comic);
			});
	}

    if (error404){
        return (
			<div>
				<h2>Couldn't find any comics on this page, maybe try another</h2>
			</div>
		);
    }

	if (loading) {
		return (
			<div>
				<h2>Loading....</h2>
			</div>
		);
	} else if (!searchTerm && itemOffset !== 0) {
        return (
            <div>
                <Search searchValue={searchValue} />
                <br />
                <br />
                <Grid container className={classes.grid} spacing={5}>
                    {card}
                </Grid>
                <ReactPaginate
                    containerClassName={classes.pagination}
                    pageClassName={classes.page}
                    pageLinkClassName={classes.pageLink}
                    activeLinkClassName={classes.activeLink}
                    forcePage={itemOffset/cardsPerPage}
                    breakLabel="..."
                    nextLabel="next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    previousLabel="< previous"
                />
            </div>
        );
	} else if(!searchTerm) {
        return (
            <div>
                <Search searchValue={searchValue} />
                <br />
                <br />
                <Grid container className={classes.grid} spacing={5}>
                    {card}
                </Grid>
                <ReactPaginate
                    containerClassName={classes.pagination}
                    pageClassName={classes.page}
                    pageLinkClassName={classes.pageLink}
                    activeLinkClassName={classes.activeLink}
                    forcePage={itemOffset/cardsPerPage}
                    breakLabel="..."
                    nextLabel="next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    previousLabel=""
                />
            </div>
        );
    } else {
        return (
        <div>
            <Search searchValue={searchValue} />
            <br />
            <br />
            <Grid container className={classes.grid} spacing={5}>
                {card}
            </Grid>
        </div>
        );
    }
};

export default ComicList;
