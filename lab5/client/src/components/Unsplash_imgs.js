import React, { useState, useEffect } from 'react';
import Common from './Common';

const Unsplash_imgs = (props) => {
    const [ images, setImages ] = useState([]);
    // const [ loading, setLoading ] = useState(true);
    // const [ error, setError ] = useState(false);
    // const classes = useStyles();

    // let card = null;

    useEffect(() => {
        // async calls to apollo backend
        let res = useQuery(GET_UNSPLASH_IMAGES);
        setImages(res);
    }, [images]);

    return (
        <div>
            <Common images={images} />
            <button onClick={() => {
                // TODO: have get more call backend
            }}>Get more</button>
        </div>
    );
}

export default Unsplash_imgs;