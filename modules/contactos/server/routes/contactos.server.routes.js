'use strict';

/**
 * Module dependencies
 */
var contactosPolicy = require('../policies/contactos.server.policy'),
  contactos = require('../controllers/contactos.server.controller');

module.exports = function (app) {
  // Contactos collection routes
  app.route('/api/contactos')
    .get(contactosPolicy.isAllowed, contactos.list)
    .post(contactos.create);

  // Single contacto routes
  app.route('/api/contactos/:contactoId').all(contactosPolicy.isAllowed)
    .get(contactos.read)
    .put(contactos.update)
    .delete(contactos.delete);

  // Finish by binding the contacto middleware
  app.param('contactoId', contactos.contactoByID);
};
