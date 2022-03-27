import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import noImage from '../img/download.jpeg';
import { makeStyles, Card, CardContent, CardMedia, Typography, CardHeader } from '@material-ui/core';
import '../App.css';
import md5 from 'blueimp-md5';

const publickey = 'a929b3cec4ce202cbd929a563541589a';
const privatekey = 'a0643c86dcceb3551471c50f1cfd2220b46a4e14';

const useStyles = makeStyles({
	card: {
		maxWidth: 550,
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

const Comic = (props) => {
	const [ charData, setCharData ] = useState(undefined);
	const [ loading, setLoading ] = useState(true);
    const [ error404, setError404 ] = useState(false);
	const classes = useStyles();

	// const tConvert = (time) => {
	// 	// Check correct time format and split into components
	// 	time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [ time ];

	// 	if (time.length > 1) {
	// 		// If time format correct
	// 		time = time.slice(1); // Remove full string match value
	// 		time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
	// 		time[0] = +time[0] % 12 || 12; // Adjust hours
	// 	}
	// 	return time.join(''); // return adjusted time or original string
	// };
	// const formatDate = (showdate) => {
	// 	var year = showdate.substring(0, 4);
	// 	var month = showdate.substring(5, 7);
	// 	var day = showdate.substring(8, 10);
	// 	return month + '/' + day + '/' + year;
	// };

	useEffect(
		() => {
			console.log ("useEffect fired")
			async function fetchData() {
				try {
                    const ts = new Date().getTime();
                    const stringToHash = ts + privatekey + publickey;
                    const hash = md5(stringToHash);
                    const baseUrl = 'https://gateway.marvel.com:443/v1/public/comics/';
                    const url = baseUrl + props.match.params.id + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash
                    const data = await axios.get(url);
                    data.data.data.results[0].characters.items.length = Math.min(data.data.data.results[0].characters.items.length, 10);

                    console.log(data.data.data.results[0]);

                    setCharData(data.data.data.results[0]);
					setLoading(false);
				} catch (e) {
					console.log(e);
                    setError404(true);
				}
			}
			fetchData();
		},
		[ props.match.params.id ]
	);

	if (loading) {
		return (
			<div>
				<h2>Loading....</h2>
			</div>
		);
	} else if (error404) {
        return (
            <div>
                <h2>404: No character found with that ID.</h2>
            </div>
        );
    } else {
        if(!charData.description){
            charData.description = 'No description available';
        }
		return (
			<Card className={classes.card} variant='outlined'>
				<CardHeader className={classes.titleHead} title={charData.title} />
				<CardMedia
					className={classes.media}
					component='img'
					image={charData.thumbnail.path ? charData.thumbnail.path + "/portrait_xlarge." + charData.thumbnail.extension : noImage}
					title='character image'
				/>

				<CardContent>
					<Typography variant='body2' color='textSecondary' component='span'>
						<dl>
							<p>
								<dt className='title'>Description:</dt>
								<dd>{charData.description}</dd>
							</p>
							

							<p>
								<dt className='title'>Characters: </dt>
								{charData && charData.characters.items && charData.characters.items.length >= 1 ? (
									<span>
										{charData.characters.items.map((comic) => {
											if (charData.characters.items.length > 1) return <Link to={'/characters/' + /[^/]*$/.exec(comic.resourceURI)[0]} key = {comic.resourceURI}> {comic.name},</Link>;
											return <Link to={'/characters/' + /[^/]*$/.exec(comic.resourceURI)[0]} key = {comic.resourceURI}>{comic.name}</Link>;
										})}
									</span>
								) : (
									<dd>N/A</dd>
								)}
							</p>
                            <p>
                                <dt className='title'>Series: </dt>
                                <Link to={'/series/' + /[^/]*$/.exec(charData.series.resourceURI)[0]} key = {charData.series.resourceURI}> {charData.series.name}</Link>
							</p>
						</dl>
						<Link to='/comics/page/0'>Back to all comics...</Link>
					</Typography>
				</CardContent>
			</Card>
		);
	}
};

export default Comic;
