'use strict';

/**
 * Module dependencies
 */
var transaccion_cuentasPolicy = require('../policies/transaccion_cuentas.server.policy'),
  transaccion_cuentas = require('../controllers/transaccion_cuentas.server.controller');

module.exports = function (app) {
  // Transaccion_cuentas collection routes
  app.route('/api/transaccion_cuentas').all(transaccion_cuentasPolicy.isAllowed)
    .get(transaccion_cuentas.list)
    .post(transaccion_cuentas.create);

  app.route('/api/transaccionstatus/:identificador')
    .get(transaccion_cuentas.getstatus);

  // Single transaccion_cuenta routes
  app.route('/api/transaccion_cuentas/:transaccion_cuentaId').all(transaccion_cuentasPolicy.isAllowed)
    .get(transaccion_cuentas.read)
    .put(transaccion_cuentas.update)
    .delete(transaccion_cuentas.delete);

  app.route('/api/dailytransactions')
    .get(transaccion_cuentas.getDailyTransactions);

  app.route('/api/beforedaytransactions')
    .get(transaccion_cuentas.getBeforeDay);

  // Finish by binding the transaccion_cuenta middleware
  app.param('transaccion_cuentaId', transaccion_cuentas.transaccion_cuentaByID);
};
