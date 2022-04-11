import React, { useState, useEffect } from 'react';
import Common from './Common';
import { useQuery } from '@apollo/client';
import queries from '../queries';

const My_posts = (props) => {
    const {loading, error, data} = useQuery(queries.GET_USER_POSTED_IMAGES);
    
    if(loading){
        return <p>Loading...</p>;
    }

    return (
        <div>
            <Common images={data.userPostedImages} my_posts={true} />
            <button onClick={() => {
                // TODO: have Get More call backend
            }}>Get More</button>
        </div>
    );
}

export default My_posts;