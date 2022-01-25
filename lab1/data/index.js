const blogRoutes = require('./blog');
const commentRoutes = require('./comment');
const userRoutes = require('./users');

module.exports = {
    blogs: blogRoutes,
    comments: commentRoutes,
    users: userRoutes
}