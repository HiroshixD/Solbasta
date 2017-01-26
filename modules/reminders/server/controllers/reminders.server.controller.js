'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Reminder = mongoose.model('Reminder'),
  Producto = mongoose.model('Producto'),
  objectId = require('mongoose').Types.ObjectId,
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an reminder
 */
exports.create = function (req, res) {
  var reminder = new Reminder(req.body);
  reminder.user = req.user;
  reminder.subasta = req.body.subasta;

  reminder.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(reminder);
    }
  });
};

/**
 * Show the current reminder
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var reminder = req.reminder ? req.reminder.toJSON() : {};

  // Add a custom field to the Reminder, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Reminder model.
  reminder.isCurrentUserOwner = !!(req.user && reminder.user && reminder.user._id.toString() === req.user._id.toString());

  res.json(reminder);
};

/**
 * Update an reminder
 */
exports.update = function (req, res) {
  var reminder = req.reminder;

  reminder.title = req.body.title;
  reminder.content = req.body.content;

  reminder.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(reminder);
    }
  });
};

/**
 * Delete an reminder
 */
exports.delete = function (req, res) {
  var reminder = req.reminder;

  reminder.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(reminder);
    }
  });
};

/**
 * List of Reminders
 */
exports.list = function (req, res) {
  Reminder.find().sort('-created').populate('user', 'displayName email').exec(function (err, reminders) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(reminders);
    }
  });
};

exports.listForIds = function (req, res) {
  var user = req.params.user;
  var subasta = req.params.subasta;
  Reminder.find({ subasta: objectId(subasta), user: objectId(user) }).sort('-created').populate('user', 'displayName').exec(function (err, reminders) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(reminders);
    }
  });
};

//  DeepPopulate - deeppopulate
exports.getRemindersByUser = function(req, res) {
  var user = req.params.idusuario;
  Reminder.find({ user: objectId(user) }).sort('-created').populate('user', 'displayName').populate('subasta', 'producto fecha_inicio titulo descripcion_corta').exec(function (err, reminders) {
    Producto.populate(reminders, {
      path: 'subasta.producto',
      select: 'precio_normal thumbnail_1'
    }, function (error, updatedUser) {
      reminders = updatedUser;
      res.json(reminders);
    });
  });
};

exports.removeReminderById = function(req, res) {
  var idreminder = req.body.reminder;
  Reminder.find({ _id: objectId(idreminder) }).remove().exec(function (err, reminders) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json('Tu recordatorio ha sido eliminado');
    }
  });
};

exports.removeReminder = function (req, res) {
  var subasta = req.params.subasta;
  var user = req.params.user;
  Reminder.find({ subasta: objectId(subasta), user: objectId(user) }).remove().exec(function (err, reminders) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(reminders);
    }
  });
};
/**
 * Reminder middleware
 */
exports.reminderByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Reminder is invalid'
    });
  }

  Reminder.findById(id).populate('user', 'displayName').exec(function (err, reminder) {
    if (err) {
      return next(err);
    } else if (!reminder) {
      return res.status(404).send({
        message: 'No reminder with that identifier has been found'
      });
    }
    req.reminder = reminder;
    next();
  });
};
