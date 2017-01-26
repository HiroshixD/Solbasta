'use strict';

/**
 * Module dependencies
 */
var marcasPolicy = require('../policies/marcas.server.policy'),
  marcas = require('../controllers/marcas.server.controller');

module.exports = function (app) {
  // Marcas collection routes
  app.route('/api/marcas').all(marcasPolicy.isAllowed)
    .get(marcas.list)
    .post(marcas.create);

  // Single marca routes
  app.route('/api/marcas/:marcaId').all(marcasPolicy.isAllowed)
    .get(marcas.read)
    .put(marcas.update)
    .delete(marcas.delete);

  // Finish by binding the marca middleware
  app.param('marcaId', marcas.marcaByID);
};
