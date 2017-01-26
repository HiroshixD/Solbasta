'use strict';

/**
 * Module dependencies
 */
var transaccionsPolicy = require('../policies/transaccions.server.policy'),
  transaccions = require('../controllers/transaccions.server.controller');

module.exports = function (app) {
  // Transaccions collection routes
  app.route('/api/transaccions').all(transaccionsPolicy.isAllowed)
    .get(transaccions.list)
    .post(transaccions.create);

  // Single transaccion routes
  app.route('/api/transaccions/:transaccionId').all(transaccionsPolicy.isAllowed)
    .get(transaccions.read)
    .put(transaccions.update)
    .delete(transaccions.delete);

  app.route('/api/transaccionsbyid/:auctionid')
    .get(transaccions.readTransactionForAuction);

  // Finish by binding the transaccion middleware
  app.param('transaccionId', transaccions.transaccionByID);
  app.param('auctionid', transaccions.transactionForAuction);
};
