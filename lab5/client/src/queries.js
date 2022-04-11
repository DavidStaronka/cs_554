import {gql} from '@apollo/client';

const GET_UNSPLASH_IMAGES = gql`
    query Query($pageNum: Int) {
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
    query Query {
        binnedImages {
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
    query Query {
        userPostedImages {
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
    mutation Mutation($url: String!, $description: String, $posterName: String) {
        uploadImage(url: $url, description: $description, posterName: $posterName) {
            id
            url
            description
            posterName
            userPosted
            binned
        }
    }
`;

const UPDATE_IMAGE = gql`
    mutation Mutation($updateImageId: ID!, $url: String, $posterName: String, $description: String, $userPosted: Boolean, $binned: Boolean) {
        updateImage(id: $updateImageId, url: $url, posterName: $posterName, description: $description, userPosted: $userPosted, binned: $binned) {
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
    mutation Mutation($deleteImageId: ID!) {
        deleteImage(id: $deleteImageId) {
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