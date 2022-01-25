const express = require('express');
const session = require('express-session')

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const configRoutes = require('./routes');



app.use(
    session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 3600000}
    })
);

app.use(function(req, res, next) {
    console.log(`[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl} (${req.session.user ? 'Authenticated' : 'Not Authenticated'})`);
    next();
});

app.post('/blog/:id/comments', (req, res, next) => {
    // console.log(req.url);
    if (!req.session.user) {
        return res.status(401).json({error: 'User must be logged in to create a comment'});
    } else {
        return next();
    }
});

app.post('/blog', (req, res, next) => {
    // console.log(req.url);
    if (!req.session.user) {
        return res.status(401).json({error: 'User must be logged in to create a blog post'});
    } else {
        return next();
    } 
});

app.put('/blog/:id', (req, res, next) => {
    // console.log(req.url);
    if (!req.session.user) {
        return res.status(401).json({error: 'User must be logged in to update a blog post'});
    } else {
        return next();
    } 
});

app.patch('/blog/:id', (req, res, next) => {
    // console.log(req.url);
    if (!req.session.user) {
        return res.status(401).json({error: 'User must be logged in to update a blog post'});
    } else {
        return next();
    } 
});

app.delete('/blog/:blogId/:commentId', (req, res, next) => {
    // console.log(req.url);
    if (!req.session.user) {
        return res.status(401).json({error: 'User must be logged in to delete a comment'});
    } else {
        return next();
    }
});

configRoutes(app);

app.listen(3000, () => {
  console.log('Your routes will be running on http://localhost:3000');
});