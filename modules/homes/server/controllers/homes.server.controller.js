'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  moment = require('moment'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.getServerTime = function(req, res) {
  var servertime = moment().add(-5, 'hours');
  res.json(servertime);
};
