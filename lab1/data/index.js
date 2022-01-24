const blogRoutes = require('./blog');
const commentRoutes = require('./comment');

module.exports = {
    blogs: blogRoutes,
    comments: commentRoutes
}