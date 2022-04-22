const pokeRoutes = require('./pokemon');

const constructorMethod = (app) => {
  app.use('/pokemon', pokeRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};

module.exports = constructorMethod;