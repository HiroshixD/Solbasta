'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Transaccion_cuenta = mongoose.model('Transaccion_cuenta'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  moment = require('moment');

/**
 * Create an transaccion_cuenta
 */
exports.create = function (req, res) {
  var transaccion_cuenta = new Transaccion_cuenta(req.body);
  transaccion_cuenta.user = req.user;

  transaccion_cuenta.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(transaccion_cuenta);
    }
  });
};

/**
 * Show the current transaccion_cuenta
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var transaccion_cuenta = req.transaccion_cuenta ? req.transaccion_cuenta.toJSON() : {};

  // Add a custom field to the Transaccion_cuenta, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Transaccion_cuenta model.
  transaccion_cuenta.isCurrentUserOwner = !!(req.user && transaccion_cuenta.user && transaccion_cuenta.user._id.toString() === req.user._id.toString());

  res.json(transaccion_cuenta);
};

/**
 * Update an transaccion_cuenta
 */
exports.update = function (req, res) {
  var transaccion_cuenta = req.transaccion_cuenta;

  transaccion_cuenta.title = req.body.title;
  transaccion_cuenta.content = req.body.content;

  transaccion_cuenta.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(transaccion_cuenta);
    }
  });
};

/**
 * Delete an transaccion_cuenta
 */
exports.delete = function (req, res) {
  var transaccion_cuenta = req.transaccion_cuenta;

  transaccion_cuenta.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(transaccion_cuenta);
    }
  });
};

/**
 * List of Transaccion_cuentas
 */
exports.list = function (req, res) {
  Transaccion_cuenta.find().sort('-created').populate('user', 'displayName').exec(function (err, transaccion_cuentas) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(transaccion_cuentas);
    }
  });
};

exports.getstatus = function (req, res) {
  var id = req.params.identificador;
  Transaccion_cuenta.find({ identificador: id }).sort('-created').populate('user', 'displayName').exec(function (err, transaccion_cuentas) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(transaccion_cuentas);
    }
  });
};

exports.getDailyTransactions = function(re, res) {
  var server = moment(new Date()).add('-5', 'hours').format("YYYY-MM-DD");
  var serveradd = moment(new Date()).add('-5', 'hours').add('1', 'days').format("YYYY-MM-DD");
  Transaccion_cuenta.find({ "fecha_compra": { "$gte": server, "$lt": serveradd } }).sort('-created').populate('user', 'displayName').exec(function (err, transaccion_cuentas) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(transaccion_cuentas);
    }
  });
};

exports.getBeforeDay = function(re, res) {
  var server = moment(new Date()).add('-5', 'hours').add('-1', 'days').format("YYYY-MM-DD");
  var serveradd = moment(new Date()).add('-5', 'hours').format("YYYY-MM-DD");
  Transaccion_cuenta.find({ "fecha_compra": { "$gte": server, "$lt": serveradd } }).sort('-created').populate('user', 'displayName').exec(function (err, transaccion_cuentas) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(transaccion_cuentas);
    }
  });
};
/**
 * Transaccion_cuenta middleware
 */
exports.transaccion_cuentaByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Transaccion_cuenta is invalid'
    });
  }

  Transaccion_cuenta.findById(id).populate('user', 'displayName').exec(function (err, transaccion_cuenta) {
    if (err) {
      return next(err);
    } else if (!transaccion_cuenta) {
      return res.status(404).send({
        message: 'No transaccion_cuenta with that identifier has been found'
      });
    }
    req.transaccion_cuenta = transaccion_cuenta;
    next();
  });
};
