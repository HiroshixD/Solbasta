'use strict';

/**
 * Module dependencies
 */
var tipo_subastasPolicy = require('../policies/tipo_subastas.server.policy'),
  tipo_subastas = require('../controllers/tipo_subastas.server.controller');

module.exports = function (app) {
  // Tipo_subastas collection routes
  app.route('/api/tipo_subastas').all(tipo_subastasPolicy.isAllowed)
    .get(tipo_subastas.list)
    .post(tipo_subastas.create);

  // Single tipo_subasta routes
  app.route('/api/tipo_subastas/:tipo_subastaId').all(tipo_subastasPolicy.isAllowed)
    .get(tipo_subastas.read)
    .put(tipo_subastas.update)
    .delete(tipo_subastas.delete);

  // Finish by binding the tipo_subasta middleware
  app.param('tipo_subastaId', tipo_subastas.tipo_subastaByID);
};
