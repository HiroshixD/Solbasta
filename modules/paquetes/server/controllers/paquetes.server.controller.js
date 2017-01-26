'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Paquete = mongoose.model('Paquete'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an paquete
 */
exports.create = function (req, res) {
  var paquete = new Paquete(req.body);
  paquete.user = req.user;

  paquete.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(paquete);
    }
  });
};

/**
 * Show the current paquete
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var paquete = req.paquete ? req.paquete.toJSON() : {};

  // Add a custom field to the Paquete, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Paquete model.
  paquete.isCurrentUserOwner = !!(req.user && paquete.user && paquete.user._id.toString() === req.user._id.toString());

  res.json(paquete);
};

/**
 * Update an paquete
 */
exports.update = function (req, res) {
  var paquete = req.paquete;

  paquete.title = req.body.title;
  paquete.content = req.body.content;

  paquete.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(paquete);
    }
  });
};

/**
 * Delete an paquete
 */
exports.delete = function (req, res) {
  var paquete = req.paquete;

  paquete.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(paquete);
    }
  });
};

/**
 * List of Paquetes
 */
exports.list = function (req, res) {
  Paquete.find().sort('-created').populate('user', 'displayName').exec(function (err, paquetes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(paquetes);
    }
  });
};

/**
 * Paquete middleware
 */
exports.paqueteByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Paquete is invalid'
    });
  }

  Paquete.findById(id).populate('user', 'displayName').exec(function (err, paquete) {
    if (err) {
      return next(err);
    } else if (!paquete) {
      return res.status(404).send({
        message: 'No paquete with that identifier has been found'
      });
    }
    req.paquete = paquete;
    next();
  });
};
