'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Transaccion = mongoose.model('Transaccion'),
  objectId = require('mongoose').Types.ObjectId,
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an transaccion
 */
exports.create = function (req, res) {
  var transaccion = new Transaccion(req.body);
  transaccion.subasta = req.body.subasta.substring(0, 24);
  transaccion.transaccion_token = req.body.subasta.substring(24, 36);

  transaccion.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    transaccion.populate('user', 'username displayName', function(err, data) {
      res.json(data);
    });
  });
};

/**
 * Show the current transaccion
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var transaccion = req.transaccion ? req.transaccion.toJSON() : {};

  // Add a custom field to the Transaccion, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Transaccion model.
  transaccion.isCurrentUserOwner = !!(req.user && transaccion.user && transaccion.user._id.toString() === req.user._id.toString());

  res.json(transaccion);
};

/**
 * Update an transaccion
 */
exports.update = function (req, res) {
  var transaccion = req.transaccion;

  transaccion.title = req.body.title;
  transaccion.content = req.body.content;

  transaccion.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(transaccion);
    }
  });
};

/**
 * Delete an transaccion
 */
exports.delete = function (req, res) {
  var transaccion = req.transaccion;

  transaccion.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(transaccion);
    }
  });
};

/**
 * List of Transaccions
 */
exports.list = function (req, res) {
  Transaccion.find().sort('-created').populate('user', 'displayName').exec(function (err, transaccions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(transaccions);
    }
  });
};

exports.transactionForAuction = function (req, res) {
  var idsubasta = req.params.auctionid;
  Transaccion.find({ 'subasta': objectId(idsubasta) }).sort('-created').populate('user', 'displayName username').exec(function (err, transaccions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(transaccions);
    }
  });
};

exports.readTransactionForAuction = function (req, res) {
  console.log('hola');
  // convert mongoose document to JSON
  var transaccions = req.transaccions ? req.transaccions.toJSON() : {};

  // Add a custom field to the Transaccion, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Transaccion model.
  transaccions.isCurrentUserOwner = !!(req.user && transaccions.user && transaccions.user._id.toString() === req.user._id.toString());

  res.json(transaccions);
};

/**
 * Transaccion middleware
 */
exports.transaccionByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Transaccion is invalid'
    });
  }

  Transaccion.findById(id).populate('user', 'displayName').exec(function (err, transaccion) {
    if (err) {
      return next(err);
    } else if (!transaccion) {
      return res.status(404).send({
        message: 'No transaccion with that identifier has been found'
      });
    }
    req.transaccion = transaccion;
    next();
  });
};
