const express = require('express');
const { redirect } = require('express/lib/response');
const router = express.Router();
const data = require('../data');
const blogs = data.blogs;
const comments = data.comments;
const users = data.users;
let { ObjectId } = require('mongodb');

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

function stringCheck(str) {
    return typeof str === 'string' && str.length > 0 && str.replace(/\s/g, "").length > 0;
}

function validateId(id) {
    if(!id || typeof id !== 'string' || !stringCheck(id) || !ObjectId.isValid(id))
        throw new Error('id must be a valid ObjectId string');
}

router.get('/', async (req, res) => {
    try{
        if(!req.query.take) req.query.take = 20;
        if(!req.query.skip) req.query.skip = 0;
        if(typeof parseInt(req.query.take) !== 'number' || parseInt(req.query.take) < 0 || parseInt(req.query.take) > 100)
            throw new Error("numBlogs must be a non-negative number less than or equal to 100");
        if(typeof parseInt(req.query.skip) !== 'number' || parseInt(req.query.skip) < 0)
            throw new Error("skip must be a non-negative number");

        const returned_blogs = await blogs.get_blogs(parseInt(req.query.take), parseInt(req.query.skip));
        res.json({response: returned_blogs});
    } catch(e){
        res.status(400).json({error: e.toString()});
        return;
    }
});

router.get('/logout', async (req, res) => {
    try{
        req.session.destroy();
        res.json({response: "Logged out"});
    }
    catch(e){
        res.status(400).json({error: e.toString()});
        return;
    }
});

router.get('/:id', async (req, res) => {
    try{
        validateId(req.params.id);

        const returned_blog = await blogs.get_blog(req.params.id);
        res.json({response: returned_blog});
    }
    catch(e){
        res.status(400).json({error: e.toString()});
        return;
    }
});

router.post('/', async (req, res) => {
    try{
        type_checker(req.body.title, "string", "Title must be a non-empty string");
        type_checker(req.body.body, "string", "Body must be a non-empty string");

        const newBlog = await blogs.create(req.body.title, req.body.body, req.session.user);
        res.json({response: newBlog});
    }
    catch(e){
        res.status(400).json({error: e.toString()});
        return;
    }
});

router.put('/:id', async (req, res) => {
    try{
        validateId(req.params.id);
        if(!req.body.title || !req.body.body) throw new Error("All fields must be filled for a PUT request");
        type_checker(req.body.title, "string", "Title must be a non-empty string");
        type_checker(req.body.body, "string", "Body must be a non-empty string");

        const updatedBlog = await blogs.update_blog(req.params.id, req.body.title, req.body.body, req.session.user);
        res.json({response: updatedBlog});
    }
    catch(e){
        console.log(e);
        res.status(400).json({error: e.toString()});
        return;
    }
});

router.patch('/:id', async (req, res) => {
    try{
        validateId(req.params.id);
        if(req.body.title)
            type_checker(req.body.title, "string", "Title must be a non-empty string");
        if(req.body.body)
            type_checker(req.body.body, "string", "Body must be a non-empty string");

        const updatedBlog = await blogs.update_blog(req.params.id, req.body.title, req.body.body, req.session.user);
        res.json({response: updatedBlog});
    }
    catch(e){
        res.status(400).json({error: e.toString()});
        return;
    }
});

router.post('/:id/comments', async (req, res) => {
    try{
        validateId(req.params.id);
        type_checker(req.body.body, "string", "Body must be a non-empty string");

        const newComment = await comments.create(req.params.id, req.session.user, req.body.body);
        res.json({response: newComment});
    }
    catch(e){
        res.status(400).json({error: e.toString()});
        return;
    }
});

router.delete('/:blogId/:commentId', async (req, res) => {
    try{
        validateId(req.params.blogId);
        validateId(req.params.commentId);

        const deletedComment = await comments.delete_comment(req.params.blogId, req.params.commentId, req.session.user);
        res.json(deletedComment);
    }
    catch(e){
        res.status(400).json({error: e.toString()});
        return;
    }
});

router.post('/signup', async (req, res) => {
    try{
        type_checker(req.body.name, "string", "name must be a non-empty string");
        type_checker(req.body.username, "string", "Username must be a non-empty string");
        type_checker(req.body.password, "string", "Password must be a non-empty string");

        const newUser = await users.create(req.body.name, req.body.username, req.body.password);
        res.json({response: newUser});
    }
    catch(e){
        res.status(400).json({error: e.toString()});
        return;
    }
});

router.post('/login', async (req, res) => {
    try{
        type_checker(req.body.username, "string", "Username must be a non-empty string");
        type_checker(req.body.password, "string", "Password must be a non-empty string");

        const user = await users.login_validation(req.body.username, req.body.password);
        req.session.user = user;
        res.json({response: user});
    }
    catch(e){
        res.status(400).json({error: e.toString()});
        return;
    }
});



//TODO - add type checking for routes
//TODO - add middleware
module.exports = router;