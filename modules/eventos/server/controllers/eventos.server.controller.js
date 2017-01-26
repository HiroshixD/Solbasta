'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Evento = mongoose.model('Evento'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an evento
 */
exports.create = function (req, res) {
  var evento = new Evento(req.body);
  evento.user = req.user;

  evento.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(evento);
    }
  });
};

/**
 * Show the current evento
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var evento = req.evento ? req.evento.toJSON() : {};

  // Add a custom field to the Evento, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Evento model.
  evento.isCurrentUserOwner = !!(req.user && evento.user && evento.user._id.toString() === req.user._id.toString());

  res.json(evento);
};

/**
 * Update an evento
 */
exports.update = function (req, res) {
  var evento = req.evento;

  evento.title = req.body.title;
  evento.content = req.body.content;

  evento.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(evento);
    }
  });
};

/**
 * Delete an evento
 */
exports.delete = function (req, res) {
  var evento = req.evento;

  evento.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(evento);
    }
  });
};

/**
 * List of Eventos
 */
exports.list = function (req, res) {
  Evento.find().sort('-created').populate('user', 'displayName').exec(function (err, eventos) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(eventos);
    }
  });
};

/**
 * Evento middleware
 */
exports.eventoByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Evento is invalid'
    });
  }

  Evento.findById(id).populate('user', 'displayName').exec(function (err, evento) {
    if (err) {
      return next(err);
    } else if (!evento) {
      return res.status(404).send({
        message: 'No evento with that identifier has been found'
      });
    }
    req.evento = evento;
    next();
  });
};
