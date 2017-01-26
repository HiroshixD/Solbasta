'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Datos_envio = mongoose.model('Datos_envio'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an datos_envio
 */
exports.create = function (req, res) {
  var datos_envio = new Datos_envio(req.body);
  datos_envio.user = req.user;

  datos_envio.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(datos_envio);
    }
  });
};

/**
 * Show the current datos_envio
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var datos_envio = req.datos_envio ? req.datos_envio.toJSON() : {};

  // Add a custom field to the Datos_envio, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Datos_envio model.
  datos_envio.isCurrentUserOwner = !!(req.user && datos_envio.user && datos_envio.user._id.toString() === req.user._id.toString());

  res.json(datos_envio);
};

/**
 * Update an datos_envio
 */
exports.update = function (req, res) {
  var datos_envio = req.datos_envio;

  datos_envio.direccion = req.body.direccion;
  datos_envio.entrega = req.body.entrega;
  datos_envio.direccion_destinatario = req.body.direccion_destinatario;
  datos_envio.direccion_calle = req.body.direccion_calle;
  datos_envio.direccion_referencia = req.body.direccion_referencia;
  datos_envio.entrega_destinatario = req.body.entrega_destinatario;
  datos_envio.entrega_calle = req.body.entrega_calle;
  datos_envio.entrega_referencia = req.body.entrega_referencia;


  datos_envio.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(datos_envio);
    }
  });
};

/**
 * Delete an datos_envio
 */
exports.delete = function (req, res) {
  var datos_envio = req.datos_envio;

  datos_envio.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(datos_envio);
    }
  });
};

/**
 * List of Datos_envios
 */
exports.list = function (req, res) {
  Datos_envio.find().sort('-created').populate('user', 'displayName').exec(function (err, datos_envios) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(datos_envios);
    }
  });
};


exports.getUserAdress = function(req, res) {
  var idusuario = req.body.userdataid;
  Datos_envio.find({ _id: idusuario }).sort('-created').populate('user', 'displayName email telefono').populate('entrega', 'departamento provincia distrito').populate('direccion', 'departamento provincia distrito').exec(function (err, datos_envios) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(datos_envios);
    }
  });
};
/**
 * Datos_envio middleware
 */
exports.datos_envioByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Datos_envio is invalid'
    });
  }

  Datos_envio.findById(id).populate('user', 'displayName').exec(function (err, datos_envio) {
    if (err) {
      return next(err);
    } else if (!datos_envio) {
      return res.status(404).send({
        message: 'No datos_envio with that identifier has been found'
      });
    }
    req.datos_envio = datos_envio;
    next();
  });
};
