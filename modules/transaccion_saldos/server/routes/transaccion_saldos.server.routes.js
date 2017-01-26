'use strict';

/**
 * Module dependencies
 */
var transaccion_saldosPolicy = require('../policies/transaccion_saldos.server.policy'),
  transaccion_saldos = require('../controllers/transaccion_saldos.server.controller');

module.exports = function (app) {
  // Transaccion_saldos collection routes
  app.route('/api/transaccion_saldos').all(transaccion_saldosPolicy.isAllowed)
    .get(transaccion_saldos.list)
    .post(transaccion_saldos.create);

  // Single transaccion_saldo routes
  app.route('/api/transaccion_saldos/:transaccion_saldoId').all(transaccion_saldosPolicy.isAllowed)
    .get(transaccion_saldos.read)
    .delete(transaccion_saldos.delete);

  app.route('/api/transaccion_saldos_user/:userid')
    .get(transaccion_saldos.transaccionByUserId);

  // Finish by binding the transaccion_saldo middleware
  app.param('transaccion_saldoId', transaccion_saldos.transaccion_saldoByID);
  app.param('userid', transaccion_saldos.transaccionByUserId);
};
