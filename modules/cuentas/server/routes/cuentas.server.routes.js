'use strict';

/**
 * Module dependencies
 */
var cuentasPolicy = require('../policies/cuentas.server.policy'),
  cuentas = require('../controllers/cuentas.server.controller');

module.exports = function (app) {
  // Cuentas collection routes
  app.route('/api/cuentas').all(cuentasPolicy.isAllowed)
    .get(cuentas.list);
  // Single cuenta routes
  app.route('/api/cuentas/:cuentaId').all(cuentasPolicy.isAllowed)
    .get(cuentas.read)
    .put(cuentas.update)
    .delete(cuentas.delete);

  app.route('/api/saldo/:cuentaId')
    .put(cuentas.updateBalance);

  app.route('/api/charge/:cuentaId/:amount')
    .put(cuentas.charge);

  // Finish by binding the cuenta middleware
  app.param('cuentaId', cuentas.cuentaByID);
};
