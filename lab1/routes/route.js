const express = require('express');
const router = express.Router();
const data = require('../data');
const blogs = data.blogs;
const comments = data.comments;
const users = data.users;

router.get('/', async (req, res) => {
    try{
        const returned_blogs = await blogs.get_blogs(parseInt(req.query.take), parseInt(req.query.skip));
        res.json({response: returned_blogs});
    } catch(e){
        res.json({error: e.toString()});
        return;
    }
});

router.get('/:id', async (req, res) => {
    try{
        const returned_blog = await blogs.get_blog(req.params.id);
        res.json({response: returned_blog});
    }
    catch(e){
        res.json({error: e.toString()});
        return;
    }
});

router.post('/', async (req, res) => {
    try{
        const newBlog = await blogs.create(req.body.title, req.body.content, req.session.user);
        res.json({response: newBlog});
    }
    catch(e){
        res.json({error: e.toString()});
        return;
    }
});

router.put('/:id', async (req, res) => {
    try{
        if(!req.body.title || !req.body.content) throw new Error("All fields must be filled for a PUT request");
        const updatedBlog = await blogs.update(req.params.id, req.body.title, req.body.content, req.session.user);
        res.json({response: updatedBlog});
    }
    catch(e){
        res.json({error: e.toString()});
        return;
    }
});

router.patch('/:id', async (req, res) => {
    try{
        const updatedBlog = await blogs.update(req.params.id, req.body.title, req.body.content, req.session.user);
        res.json({response: updatedBlog});
    }
    catch(e){
        res.json({error: e.toString()});
        return;
    }
});

router.post('/:id/comments', async (req, res) => {
    try{
        const newComment = await comments.addComment(req.params.id, req.body.content, req.session.user);
        res.json({response: newComment});
    }
    catch(e){
        res.json({error: e.toString()});
        return;
    }
});

router.delete('/:blogId/:commentId', async (req, res) => {
    try{
        const deletedComment = await comments.deleteComment(req.params.blogId, req.params.commentId, req.session.user);
        res.json(deletedComment);
    }
    catch(e){
        res.json({error: e.toString()});
        return;
    }
});

router.post('/blog/signup', async (req, res) => {
    try{
        const newUser = await users.create(req.body.name, req.body.username, req.body.password);
        res.json({response: newUser});
    }
    catch(e){
        res.json({error: e.toString()});
        return;
    }
});

//TODO - add login
//TODO - add work for login
//TODO - add type checking for routes
//TODO - add middleware
module.exports = router;