'use strict';

/**
 * Module dependencies
 */
var paquetesPolicy = require('../policies/paquetes.server.policy'),
  paquetes = require('../controllers/paquetes.server.controller');

module.exports = function (app) {
  // Paquetes collection routes
  app.route('/api/paquetes').all(paquetesPolicy.isAllowed)
    .get(paquetes.list)
    .post(paquetes.create);

  // Single paquete routes
  app.route('/api/paquetes/:paqueteId').all(paquetesPolicy.isAllowed)
    .get(paquetes.read)
    .put(paquetes.update)
    .delete(paquetes.delete);

  // Finish by binding the paquete middleware
  app.param('paqueteId', paquetes.paqueteByID);
};
