'use strict';

/**
 * Module dependencies
 */
var compartidosPolicy = require('../policies/compartidos.server.policy'),
  compartidos = require('../controllers/compartidos.server.controller');

module.exports = function (app) {
  // Compartidos collection routes
  app.route('/api/compartidos').all(compartidosPolicy.isAllowed)
    .get(compartidos.list)
    .post(compartidos.create);

  // Single compartido routes
  app.route('/api/compartidos/:compartidoId').all(compartidosPolicy.isAllowed)
    .get(compartidos.read)
    .put(compartidos.update)
    .delete(compartidos.delete);

  // Finish by binding the compartido middleware
  app.param('compartidoId', compartidos.compartidoByID);
};
