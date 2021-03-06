import React, { useState, useEffect } from 'react';
import Common from './Common';
import { useQuery } from '@apollo/client';
import queries from '../queries';

const My_bin = (props) => {
    const {loading, error, data} = useQuery(queries.GET_BINNED_IMAGES);
    // const [ loading, setLoading ] = useState(true);
    // const [ error, setError ] = useState(false);
    // const classes = useStyles();

    // let card = null;
    console.log(error);
    console.log(data);

    // useEffect(() => {
    //     // async calls to apollo backend
    //     let res = useQuery(GET_BIN_IMAGES);
    //     setImages(res);
    // }, [images]);

    if(loading){
        return <p>Loading...</p>;
    }

    return (
        <div>
            <Common images={data.binnedImages} />
        </div>
    );
}

export default My_bin;