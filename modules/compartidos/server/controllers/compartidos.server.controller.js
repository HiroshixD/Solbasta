'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Compartido = mongoose.model('Compartido'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an compartido
 */
exports.create = function (req, res) {
  var compartido = new Compartido(req.body);
  compartido.user = req.user;

  compartido.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(compartido);
    }
  });
};

/**
 * Show the current compartido
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var compartido = req.compartido ? req.compartido.toJSON() : {};

  // Add a custom field to the Compartido, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Compartido model.
  compartido.isCurrentUserOwner = !!(req.user && compartido.user && compartido.user._id.toString() === req.user._id.toString());

  res.json(compartido);
};

/**
 * Update an compartido
 */
exports.update = function (req, res) {
  var compartido = req.compartido;

  compartido.red_social = req.body.red_social;
  compartido.tipo = req.body.tipo;

  compartido.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(compartido);
    }
  });
};

/**
 * Delete an compartido
 */
exports.delete = function (req, res) {
  var compartido = req.compartido;

  compartido.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(compartido);
    }
  });
};

/**
 * List of Compartidos
 */
exports.list = function (req, res) {
  Compartido.find().sort('-created').populate('user', 'displayName').exec(function (err, compartidos) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(compartidos);
    }
  });
};

/**
 * Compartido middleware
 */
exports.compartidoByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Compartido is invalid'
    });
  }

  Compartido.findById(id).populate('user', 'displayName').exec(function (err, compartido) {
    if (err) {
      return next(err);
    } else if (!compartido) {
      return res.status(404).send({
        message: 'No compartido with that identifier has been found'
      });
    }
    req.compartido = compartido;
    next();
  });
};
