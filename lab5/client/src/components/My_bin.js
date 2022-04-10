import React, { useState, useEffect } from 'react';
import Common from './Common';

const My_bin = (props) => {
    const [ images, setImages ] = useState([]);
    // const [ loading, setLoading ] = useState(true);
    // const [ error, setError ] = useState(false);
    const classes = useStyles();

    let card = null;

    useEffect(() => {
        // async calls to apollo backend
    }, []);

    return (
        <div>
            <Common images={images} />
            <button onClick={() => {
                // TODO: have Get More call backend
            }}>Get More</button>
        </div>
    );
}

export default My_bin;