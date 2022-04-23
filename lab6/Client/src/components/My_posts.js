import React, { useState, useEffect } from 'react';
import Common from './PokemonList';
// import { useQuery } from '@apollo/client';
// import queries from '../queries';

const My_posts = (props) => {
    const {loading, error, data} = useQuery(queries.GET_USER_POSTED_IMAGES);

    if(loading){
        return <p>Loading...</p>;
    }

    return (
        <div>
            <Common images={data.userPostedImages} my_posts={true} />
        </div>
    );
}

export default My_posts;