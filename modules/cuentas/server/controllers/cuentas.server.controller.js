'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Cuenta = mongoose.model('Cuenta'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an cuenta
 */
/*  exports.create = function (req, res) {
  var cuenta = new Cuenta(req.body);
  cuenta.user = req.user;

  cuenta.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(cuenta);
    }
  });
};*/

/**
 * Show the current cuenta
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var cuenta = req.cuenta ? req.cuenta.toJSON() : {};

  // Add a custom field to the Cuenta, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Cuenta model.
  cuenta.isCurrentUserOwner = !!(req.user && cuenta.user && cuenta.user._id.toString() === req.user._id.toString());

  res.json(cuenta);
};

/**
 * Update an cuenta
 */
exports.update = function (req, res) {
  var cuenta = req.cuenta;

  cuenta.monto = req.body.monto;

  cuenta.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(cuenta);
    }
  });
};

/**
 * Delete an cuenta
 */
exports.delete = function (req, res) {
  var cuenta = req.cuenta;

  cuenta.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(cuenta);
    }
  });
};

/**
 * List of Cuentas
 */
exports.list = function (req, res) {
  Cuenta.find().sort('-created').populate('user', 'displayName birthDate created').exec(function (err, cuentas) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(cuentas);
    }
  });
};

exports.updateBalance = function(req, res) {
  var cuenta = req.cuenta;
  cuenta.monto = cuenta.monto - 1;

  cuenta.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(cuenta);
    }
  });
};

exports.charge = function(req, res) {
  var amount = req.params.amount;
  var cuenta = req.cuenta;
  cuenta.monto = (parseInt(cuenta.monto, 10) + parseInt(amount, 10));

  cuenta.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(cuenta);
    }
  });
};

/**
 * Cuenta middleware
 */
exports.cuentaByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Cuenta is invalid'
    });
  }

  Cuenta.findById(id).populate('user', 'displayName birthDate created').exec(function (err, cuenta) {
    if (err) {
      return next(err);
    } else if (!cuenta) {
      return res.status(404).send({
        message: 'No cuenta with that identifier has been found'
      });
    }
    req.cuenta = cuenta;
    next();
  });
};
