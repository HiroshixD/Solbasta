'use strict';

/**
 * Module dependencies
 */
var ubigeosPolicy = require('../policies/ubigeos.server.policy'),
  ubigeos = require('../controllers/ubigeos.server.controller');

module.exports = function (app) {
  // Ubigeos collection routes
  app.route('/api/ubigeos').all(ubigeosPolicy.isAllowed)
    .get(ubigeos.list)
    .post(ubigeos.create);

  // Single ubigeo routes
  app.route('/api/ubigeos/:ubigeoId').all(ubigeosPolicy.isAllowed)
    .get(ubigeos.read)
    .put(ubigeos.update)
    .delete(ubigeos.delete);

  app.route('/api/departamentos')
    .get(ubigeos.getDepartamentos);

  app.route('/api/provincias/:departamentonombre')
    .get(ubigeos.getProvincias);

  app.route('/api/distritos/:provincianombre')
    .get(ubigeos.getDistritos);
  // Finish by binding the ubigeo middleware
  app.param('ubigeoId', ubigeos.ubigeoByID);
};
