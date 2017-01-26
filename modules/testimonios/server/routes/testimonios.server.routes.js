'use strict';

/**
 * Module dependencies
 */
var testimoniosPolicy = require('../policies/testimonios.server.policy'),
  testimonios = require('../controllers/testimonios.server.controller');

module.exports = function (app) {
  // Testimonios collection routes
  app.route('/api/testimonios').all(testimoniosPolicy.isAllowed)
    .get(testimonios.list)
    .post(testimonios.create);

  // Single testimonio routes
  app.route('/api/testimonios/:testimonioId').all(testimoniosPolicy.isAllowed)
    .get(testimonios.read)
    .put(testimonios.update)
    .delete(testimonios.delete);

  // Finish by binding the testimonio middleware
  app.param('testimonioId', testimonios.testimonioByID);
};
