'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Tipo_subasta = mongoose.model('Tipo_subasta'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an tipo_subasta
 */
exports.create = function (req, res) {
  var tipo_subasta = new Tipo_subasta(req.body);
  tipo_subasta.user = req.user;

  tipo_subasta.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(tipo_subasta);
    }
  });
};

/**
 * Show the current tipo_subasta
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var tipo_subasta = req.tipo_subasta ? req.tipo_subasta.toJSON() : {};

  // Add a custom field to the Tipo_subasta, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Tipo_subasta model.
  tipo_subasta.isCurrentUserOwner = !!(req.user && tipo_subasta.user && tipo_subasta.user._id.toString() === req.user._id.toString());

  res.json(tipo_subasta);
};

/**
 * Update an tipo_subasta
 */
exports.update = function (req, res) {
  var tipo_subasta = req.tipo_subasta;

  tipo_subasta.nombre = req.body.nombre;
  tipo_subasta.estado = req.body.estado;
  tipo_subasta.icono = req.body.icono;
  tipo_subasta.descripcion = req.body.descripcion;


  tipo_subasta.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(tipo_subasta);
    }
  });
};

/**
 * Delete an tipo_subasta
 */
exports.delete = function (req, res) {
  var tipo_subasta = req.tipo_subasta;

  tipo_subasta.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(tipo_subasta);
    }
  });
};

/**
 * List of Tipo_subastas
 */
exports.list = function (req, res) {
  Tipo_subasta.find().sort('-created').populate('user', 'displayName').exec(function (err, tipo_subastas) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(tipo_subastas);
    }
  });
};

/**
 * Tipo_subasta middleware
 */
exports.tipo_subastaByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Tipo_subasta is invalid'
    });
  }

  Tipo_subasta.findById(id).populate('user', 'displayName').exec(function (err, tipo_subasta) {
    if (err) {
      return next(err);
    } else if (!tipo_subasta) {
      return res.status(404).send({
        message: 'No tipo_subasta with that identifier has been found'
      });
    }
    req.tipo_subasta = tipo_subasta;
    next();
  });
};
