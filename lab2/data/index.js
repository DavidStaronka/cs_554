const projectRoutes = require('./arr');
const dataRoutes = require('./get');

module.exports = {
    projects: projectRoutes,
    get: dataRoutes
}