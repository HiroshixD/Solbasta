'use strict';

/**
 * Module dependencies
 */
var eventosPolicy = require('../policies/eventos.server.policy'),
  eventos = require('../controllers/eventos.server.controller');

module.exports = function (app) {
  // Eventos collection routes
  app.route('/api/eventos').all(eventosPolicy.isAllowed)
    .get(eventos.list)
    .post(eventos.create);

  // Single evento routes
  app.route('/api/eventos/:eventoId').all(eventosPolicy.isAllowed)
    .get(eventos.read)
    .put(eventos.update)
    .delete(eventos.delete);

  // Finish by binding the evento middleware
  app.param('eventoId', eventos.eventoByID);
};
