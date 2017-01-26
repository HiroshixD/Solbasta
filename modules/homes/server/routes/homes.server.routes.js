'use strict';

/**
 * Module dependencies
 */
var homesPolicy = require('../policies/homes.server.policy'),
  homes = require('../controllers/homes.server.controller'),
  auctions = require('../sockets/dashboard.server.config');

module.exports = function (app) {

  app.route('/api/callfunction/:auction')
    .get(auctions.getNextAuctions);

  app.route('/api/getservertime')
    .get(homes.getServerTime);

};
