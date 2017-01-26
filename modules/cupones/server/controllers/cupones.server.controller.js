'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Cupon = mongoose.model('Cupon'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an cupon
 */
exports.create = function (req, res) {
  var cupon = new Cupon(req.body);
  cupon.user = req.user;

  cupon.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(cupon);
    }
  });
};

/**
 * Show the current cupon
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var cupon = req.cupon ? req.cupon.toJSON() : {};

  // Add a custom field to the Cupone, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Cupone model.
  cupon.isCurrentUserOwner = !!(req.user && cupon.user && cupon.user._id.toString() === req.user._id.toString());

  res.json(cupon);
};

/**
 * Update an cupon
 */
exports.update = function (req, res) {
  var cupon = req.cupon;

  cupon.estado = req.body.estado;

  cupon.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(cupon);
    }
  });
};

/**
 * Delete an cupone
 */
exports.delete = function (req, res) {
  var cupon = req.cupon;

  cupon.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(cupon);
    }
  });
};

/**
 * List of Cupones
 */
exports.list = function (req, res) {
  Cupon.find().sort('-created').populate('user', 'displayName').exec(function (err, cupones) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(cupones);
    }
  });
};

exports.findCouponByCode = function (req, res) {
  var codigo = req.body.codigo;
  Cupon.find({ codigo: codigo }).sort('-created').exec(function (err, cupones) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(cupones);
    }
  });
};
/**
 * Cupone middleware
 */
exports.cuponByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Cupone is invalid'
    });
  }

  Cupon.findById(id).populate('user', 'displayName').exec(function (err, cupon) {
    if (err) {
      return next(err);
    } else if (!cupon) {
      return res.status(404).send({
        message: 'No cupon with that identifier has been found'
      });
    }
    req.cupon = cupon;
    next();
  });
};
