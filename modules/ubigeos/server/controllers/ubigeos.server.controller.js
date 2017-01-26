'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Ubigeo = mongoose.model('Ubigeo'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an ubigeo
 */
exports.create = function (req, res) {
  var ubigeo = new Ubigeo(req.body);
  ubigeo.user = req.user;

  ubigeo.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(ubigeo);
    }
  });
};

/**
 * Show the current ubigeo
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var ubigeo = req.ubigeo ? req.ubigeo.toJSON() : {};

  // Add a custom field to the Ubigeo, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Ubigeo model.
  ubigeo.isCurrentUserOwner = !!(req.user && ubigeo.user && ubigeo.user._id.toString() === req.user._id.toString());

  res.json(ubigeo);
};

/**
 * Update an ubigeo
 */
exports.update = function (req, res) {
  var ubigeo = req.ubigeo;

  ubigeo.title = req.body.title;
  ubigeo.content = req.body.content;

  ubigeo.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(ubigeo);
    }
  });
};

/**
 * Delete an ubigeo
 */
exports.delete = function (req, res) {
  var ubigeo = req.ubigeo;

  ubigeo.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(ubigeo);
    }
  });
};

/**
 * List of Ubigeos
 */
exports.list = function (req, res) {
  Ubigeo.find().sort('-created').populate('user', 'displayName').exec(function (err, ubigeos) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(ubigeos);
    }
  });
};

exports.getDepartamentos = function(req, res) {
  Ubigeo.find().distinct('departamento', function(err, departamentos) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(departamentos);
    }
  });
};

exports.getProvincias = function(req, res) {
  var departamento = req.params.departamentonombre;
  Ubigeo.find({ departamento: departamento }).distinct('provincia', function(err, provincias) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(provincias);
    }
  });
};

exports.getDistritos = function(req, res) {
  var provincia = req.params.provincianombre;
  Ubigeo.find({ provincia: provincia }).exec(function (err, distritos) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(distritos);
    }
  });
};

/**
 * Ubigeo middleware
 */
exports.ubigeoByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Ubigeo is invalid'
    });
  }

  Ubigeo.findById(id).populate('user', 'displayName').exec(function (err, ubigeo) {
    if (err) {
      return next(err);
    } else if (!ubigeo) {
      return res.status(404).send({
        message: 'No ubigeo with that identifier has been found'
      });
    }
    req.ubigeo = ubigeo;
    next();
  });
};
