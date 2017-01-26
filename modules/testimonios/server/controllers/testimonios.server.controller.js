'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Testimonio = mongoose.model('Testimonio'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an testimonio
 */
exports.create = function (req, res) {
  var testimonio = new Testimonio(req.body);
  testimonio.user = req.user;

  testimonio.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(testimonio);
    }
  });
};

/**
 * Show the current testimonio
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var testimonio = req.testimonio ? req.testimonio.toJSON() : {};

  // Add a custom field to the Testimonio, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Testimonio model.
  testimonio.isCurrentUserOwner = !!(req.user && testimonio.user && testimonio.user._id.toString() === req.user._id.toString());

  res.json(testimonio);
};

/**
 * Update an testimonio
 */
exports.update = function (req, res) {
  var testimonio = req.testimonio;

  testimonio.title = req.body.title;
  testimonio.content = req.body.content;

  testimonio.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(testimonio);
    }
  });
};

/**
 * Delete an testimonio
 */
exports.delete = function (req, res) {
  var testimonio = req.testimonio;

  testimonio.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(testimonio);
    }
  });
};

/**
 * List of Testimonios
 */
exports.list = function (req, res) {
  Testimonio.find().sort('-created').populate('user', 'displayName').exec(function (err, testimonios) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(testimonios);
    }
  });
};

/**
 * Testimonio middleware
 */
exports.testimonioByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Testimonio is invalid'
    });
  }

  Testimonio.findById(id).populate('user', 'displayName').exec(function (err, testimonio) {
    if (err) {
      return next(err);
    } else if (!testimonio) {
      return res.status(404).send({
        message: 'No testimonio with that identifier has been found'
      });
    }
    req.testimonio = testimonio;
    next();
  });
};
