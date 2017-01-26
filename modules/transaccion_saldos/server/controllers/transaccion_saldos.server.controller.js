'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Transaccion_saldo = mongoose.model('Transaccion_saldo'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an transaccion_saldo
 */
exports.create = function (req, res) {
  var transaccion_saldo = new Transaccion_saldo(req.body);
  transaccion_saldo.user = req.body.user;

  transaccion_saldo.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(transaccion_saldo);
    }
  });
};

/**
 * Show the current transaccion_saldo
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var transaccion_saldo = req.transaccion_saldo ? req.transaccion_saldo.toJSON() : {};

  // Add a custom field to the Transaccion_saldo, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Transaccion_saldo model.
  transaccion_saldo.isCurrentUserOwner = !!(req.user && transaccion_saldo.user && transaccion_saldo.user._id.toString() === req.user._id.toString());

  res.json(transaccion_saldo);
};

/**
 * Delete an transaccion_saldo
 */
exports.delete = function (req, res) {
  var transaccion_saldo = req.transaccion_saldo;

  transaccion_saldo.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(transaccion_saldo);
    }
  });
};

/**
 * List of Transaccion_saldos
 */
exports.list = function (req, res) {
  Transaccion_saldo.find().sort('-created').populate('user', 'displayName').exec(function (err, transaccion_saldos) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(transaccion_saldos);
    }
  });
};

exports.transaccionByUserId = function(req, res) {
  var user = req.params.userid;
  Transaccion_saldo.find({ 'user': user }).sort('-created').populate('user', 'displayName').populate('subasta').exec(function (err, transaccion_saldos) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(transaccion_saldos);
    }
  });
};

/**
 * Transaccion_saldo middleware
 */
exports.transaccion_saldoByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Transaccion_saldo is invalid'
    });
  }

  Transaccion_saldo.findById(id).populate('user', 'displayName').exec(function (err, transaccion_saldo) {
    if (err) {
      return next(err);
    } else if (!transaccion_saldo) {
      return res.status(404).send({
        message: 'No transaccion_saldo with that identifier has been found'
      });
    }
    req.transaccion_saldo = transaccion_saldo;
    next();
  });
};
