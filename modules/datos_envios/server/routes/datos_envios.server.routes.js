'use strict';

/**
 * Module dependencies
 */
var datos_enviosPolicy = require('../policies/datos_envios.server.policy'),
  datos_envios = require('../controllers/datos_envios.server.controller');

module.exports = function (app) {
  // Datos_envios collection routes
  app.route('/api/datos_envios').all(datos_enviosPolicy.isAllowed)
    .get(datos_envios.list)
    .post(datos_envios.create);

  // Single datos_envio routes
  app.route('/api/datos_envios/:datos_envioId').all(datos_enviosPolicy.isAllowed)
    .get(datos_envios.read)
    .put(datos_envios.update)
    .delete(datos_envios.delete);

  app.route('/api/getalladresses')
    .post(datos_envios.getUserAdress);

  // Finish by binding the datos_envio middleware
  app.param('datos_envioId', datos_envios.datos_envioByID);
};
