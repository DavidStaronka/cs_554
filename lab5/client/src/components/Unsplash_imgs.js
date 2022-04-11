import React, { useState, useEffect } from 'react';
import Common from './Common';
import { useQuery } from '@apollo/client';
import queries from '../queries';

const Unsplash_imgs = (props) => {
    const [ pageNum, setPageNum ] = useState(0);

    const {loading, error, data} = useQuery(queries.GET_UNSPLASH_IMAGES, {
        variables: {pageNum: pageNum}
    });
    // const [ loading, setLoading ] = useState(true);
    // const [ error, setError ] = useState(false);
    // const classes = useStyles();

    // let card = null;

    // console.log(error);
    // console.log(data);

    // useEffect(() => {
    //     // async calls to apollo backend
        
    // }, [images]);

    if(loading){
        return <p>Loading...</p>;
    }

    if(error){
        console.log(error);
    }

    return (
        <div>
            <Common images={data.unsplashImages} />
            <button onClick={() => {
                setPageNum(pageNum + 1);
            }}>Get more</button>
        </div>
    );
}

export default Unsplash_imgs;