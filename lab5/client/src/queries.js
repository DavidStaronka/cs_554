import {gql} from '@apollo/client';

const GET_UNSPLASH_IMAGES = gql`
    query getUnsplashImages($pageNum: Int!) {
        unsplashImages(pageNum: $pageNum) {
            id
            url
            posterName
            description
            userPosted
            binned
        }
    }
`;

const GET_BINNED_IMAGES = gql`
    query {
        GetBinnedImages {
            id
            url
            posterName
            description
            userPosted
            binned
        }
    }
`;

const GET_USER_POSTED_IMAGES = gql`
    query {
        GetUserPostedImages {
            id
            url
            posterName
            description
            userPosted
            binned
        }
    }
`;

const ADD_IMAGE = gql`
    mutation($url: String!, $posterName: String!, $description: String!, $userPosted: Boolean!, $binned: Boolean!) {
        AddImage(url: $url, posterName: $posterName, description: $description, userPosted: $userPosted, binned: $binned) {
            id
            url
            posterName
            description
            userPosted
            binned
        }
    }
`;

const UPDATE_IMAGE = gql`
    mutation($id: ID!, $url: String, $posterName: String, $description: String, $userPosted: Boolean, $binned: Boolean) {
        UpdateImage(id: $id, url: $url, posterName: $posterName, description: $description, userPosted: $userPosted, binned: $binned) {
            id
            url
            posterName
            description
            userPosted
            binned
        }
    }
`;

const DELETE_IMAGE = gql`
    mutation($id: ID!) {
        DeleteImage(id: $id) {
            id
            url
            posterName
            description
            userPosted
            binned
        }
    }
`;

let exported = {
    GET_UNSPLASH_IMAGES,
    GET_BINNED_IMAGES,
    GET_USER_POSTED_IMAGES,
    ADD_IMAGE,
    UPDATE_IMAGE,
    DELETE_IMAGE
};

export default exported;