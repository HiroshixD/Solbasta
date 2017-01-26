'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Marca = mongoose.model('Marca'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an marca
 */
exports.create = function (req, res) {
  var marca = new Marca(req.body);
  marca.user = req.user;

  marca.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(marca);
    }
  });
};

/**
 * Show the current marca
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var marca = req.marca ? req.marca.toJSON() : {};

  // Add a custom field to the Marca, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Marca model.
  marca.isCurrentUserOwner = !!(req.user && marca.user && marca.user._id.toString() === req.user._id.toString());

  res.json(marca);
};

/**
 * Update an marca
 */
exports.update = function (req, res) {
  var marca = req.marca;

  marca.nombre = req.body.nombre;
  marca.estado = req.body.estado;

  marca.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(marca);
    }
  });
};

/**
 * Delete an marca
 */
exports.delete = function (req, res) {
  var marca = req.marca;

  marca.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(marca);
    }
  });
};

/**
 * List of Marcas
 */
exports.list = function (req, res) {
  Marca.find().sort('-created').populate('user', 'displayName').exec(function (err, marcas) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(marcas);
    }
  });
};

/**
 * Marca middleware
 */
exports.marcaByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Marca is invalid'
    });
  }

  Marca.findById(id).populate('user', 'displayName').exec(function (err, marca) {
    if (err) {
      return next(err);
    } else if (!marca) {
      return res.status(404).send({
        message: 'No marca with that identifier has been found'
      });
    }
    req.marca = marca;
    next();
  });
};
