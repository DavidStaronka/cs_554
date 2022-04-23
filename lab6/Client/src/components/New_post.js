import React, { useState, useEffect } from 'react';
// import { useMutation } from '@apollo/client';
// import queries from '../queries';

const New_post = (props) => {
    const [addPost, {data, loading, error}] = useMutation(queries.ADD_IMAGE);
    let body = null;
    let posterName
    let imageUrl
    let imageDesc

    body = (
        <form onSubmit={(e) => {
            e.preventDefault();
            console.log(e);
            console.log(imageUrl);
            addPost({
                variables: {
                    url: imageUrl.value,
                    description: imageDesc.value,
                    posterName: posterName.value
                }
            });
            posterName.value = '';
            imageDesc.value = '';
            imageUrl.value = '';
        }}>

            <div>
                <label>
                    Name:
                    <br />
                    <input
                    ref={(node) => {
                        posterName = node;
                    }}
                    required
                    autoFocus={true}
                    />
                </label>
            </div>
            <br />
            <div>
                <label>
                    Image URL:
                    <br />
                    <input
                    ref={(node) => {
                        imageUrl = node;
                    }}
                    required
                    />
                </label>
            </div>
            <br />
            <div>
                <label>
                    Description:
                    <br />
                    <textarea
                    ref={(node) => {
                        imageDesc = node;
                    }}
                    required
                    />
                </label>
            </div>
            <br />
            <button type='submit'>
                add post
            </button>
        </form>
    );

    if(loading){
        return <p>Handling submission</p>;
    }

    return (
        <div>
            {body}
        </div>
    );
}

export default New_post;