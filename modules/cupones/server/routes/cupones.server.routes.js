'use strict';

/**
 * Module dependencies
 */
var cuponesPolicy = require('../policies/cupones.server.policy'),
  cupones = require('../controllers/cupones.server.controller');

module.exports = function (app) {
  // Cupones collection routes
  app.route('/api/cupones').all(cuponesPolicy.isAllowed)
    .get(cupones.list)
    .post(cupones.create);

  // Single cupone routes
  app.route('/api/cupones/:cuponId').all(cuponesPolicy.isAllowed)
    .get(cupones.read)
    .put(cupones.update)
    .delete(cupones.delete);

  app.route('/api/cupon')
    .post(cupones.findCouponByCode);

  // Finish by binding the cupone middleware
  app.param('cuponId', cupones.cuponByID);
};
