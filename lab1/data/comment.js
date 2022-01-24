const mongoCollections = require('../config/mongoCollections');
const blogs = mongoCollections.blogs;
let { ObjectId } = require('mongodb');

function stringCheck(str) {
    return typeof str === 'string' && str.length > 0 && str.replace(/\s/g, "").length > 0;
}

function validateId(id) {
    if(!id || typeof id !== 'string' || !stringCheck(id) || !ObjectId.isValid(id))
        throw new Error('id must be a valid ObjectId string');
}

function ObjectIdToString(obj) {
    if(typeof obj !== 'object' || !ObjectId.isValid(obj._id))
        throw new Error('Object passed in needs to have a valid _id field');

    obj._id = obj._id.toString();

    return obj;
}

async function create(id, user, comment) {
    validateId(id);
    type_checker(user, "object", "Poster must be a user object");
    type_checker(comment, "string", "Body must be a non-empty string");
    
    const blogCollection = await blogs();

    const newComment = {
        _id: new ObjectId(),
        userThatPostedComment: user,
        comment: comment
    };

    const info = await blogCollection.updateOne({_id: new ObjectId(id)}, {$push: {comments: newComment}});

    return ObjectIdToString(newComment);
}

async function delete_comment(blogId, commentId, user) {
    validateId(blogId);
    validateId(commentId);
    type_checker(user, "object", "Poster must be a user object");

    const blogCollection = await blogs();

    const curComment = await blogCollection.findOne({_id: new ObjectId(blogId)}, {comments: {$elemMatch: {_id: new ObjectId(commentId)}}});
    if(curComment._id.toString() !== user._id.toString())
        throw new Error('User is not the poster of this comment.');

    const info = await blogCollection.updateOne({_id: new ObjectId(blogId)}, {$pull: {comments: {_id: new ObjectId(commentId)}}});

    if(info.modifiedCount === 0)
        throw new Error('Could not delete comment');

    return {response: "Successfully deleted comment"};
}

module.exports = {
    create,
    delete_comment
}