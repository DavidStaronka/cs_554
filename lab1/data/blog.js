const mongoCollections = require('../config/mongoCollections');
const blogs = mongoCollections.blogs;
let { ObjectId } = require('mongodb');

function ObjectIdToString(obj) {
    if(typeof obj !== 'object' || !ObjectId.isValid(obj._id))
        throw new Error('Object passed in needs to have a valid _id field');

    obj._id = obj._id.toString();

    return obj;
}

function validateId(id) {
    if(!id || typeof id !== 'string' || !stringCheck(id) || !ObjectId.isValid(id))
        throw new Error('id must be a valid ObjectId string');
}

function stringCheck(str) {
    return typeof str === 'string' && str.length > 0 && str.replace(/\s/g, "").length > 0;
}

function type_checker(item, type, errString, objType){
    if(item == undefined || typeof(item) != type || item.length == 0) throw errString;
    if(type == "string"){
        //got this if statement from stack overflow here: https://stackoverflow.com/questions/2031085/how-can-i-check-if-string-contains-characters-whitespace-not-just-whitespace
        if (!/\S/.test(item)) throw errString;
    }
    if(objType == "array"){
        if(!Array.isArray(item) || item.length == 0) throw errString;
    }
}

async function create(title, body, poster) {
    type_checker(title, "string", "Title must be a non-empty string");
    type_checker(body, "string", "Body must be a non-empty string");
    type_checker(poster, "object", "Poster must be a user object");

    const blogCollection = await blogs();
    
    const newBlog = {
        title: title,
        body: body,
        userThatPosted: poster,
        comments: []
    };

    const info = await blogCollection.insertOne(newBlog);

    return ObjectIdToString(newBlog);
}

async function get_blogs(numBlogs, skip) {
    if(typeof numBlogs !== 'number' || numBlogs < 0 || numBlogs > 100)
        throw new Error("numBlogs must be a non-negative number less than or equal to 100");

    if(typeof skip !== 'number' || skip < 0){
        throw new Error("skip must be a non-negative number");
    }

    const blogCollection = await blogs();

    const blogList = await blogCollection.find({}).skip(skip).limit(numBlogs).toArray();

    return blogList;
}

async function get_blog(id) {
    validateId(id);
    const blogCollection = await blogs();
    const blog = await blogCollection.findOne({ _id: ObjectId(id) });

    if(!blog)
        throw new Error("Blog not found");

    return ObjectIdToString(blog);
}

async function update_blog(id, title, body, curUser) {
    validateId(id);

    if(title)
        type_checker(title, "string", "Title must be a non-empty string");
    if(body)
        type_checker(body, "string", "Body must be a non-empty string");

    
    const blogCollection = await blogs();
    let blog = await blogCollection.findOne({ _id: ObjectId(id) });
    if(blog.userThatPosted._id.toString() != curUser._id.toString())
        throw new Error("You are not the owner of this blog");
    
    let updatedBlog = {};
    
    
    if(title && body)
        updatedBlog = await blogCollection.updateOne({ _id: ObjectId(id) }, { $set: { title: title, body: body } });
    else if(title)
        updatedBlog = await blogCollection.updateOne({ _id: ObjectId(id) }, { $set: { title: title } });
    else if(body)
        updatedBlog = await blogCollection.updateOne({ _id: ObjectId(id) }, { $set: { body: body } });
    else    
        throw new Error("No fields to update");

    if(!updatedBlog)
        throw new Error("Blog not found");

    
    blog = await blogCollection.findOne({ _id: ObjectId(id) });

    return ObjectIdToString(blog);
}


module.exports = {create, get_blogs, get_blog, update_blog};