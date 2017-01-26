'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Referral = mongoose.model('Referral'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an referral
 */
exports.create = function (req, res) {
  var referral = new Referral(req.body);
  referral.user = req.user;

  referral.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(referral);
    }
  });
};

/**
 * Show the current referral
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var referral = req.referral ? req.referral.toJSON() : {};

  // Add a custom field to the Referral, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Referral model.
  referral.isCurrentUserOwner = !!(req.user && referral.user && referral.user._id.toString() === req.user._id.toString());

  res.json(referral);
};

/**
 * Update an referral
 */
exports.update = function (req, res) {
  var referral = req.referral;
  referral.referral_account_status = req.body.referral_account_status;

  referral.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(referral);
    }
  });
};

/**
 * Delete an referral
 */
exports.delete = function (req, res) {
  var referral = req.referral;

  referral.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(referral);
    }
  });
};

/**
 * List of Referrals
 */
exports.list = function (req, res) {
  Referral.find().sort('-created').populate('user', 'displayName').exec(function (err, referrals) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(referrals);
    }
  });
};

exports.listReferrals = function (req, res) {
  var referral = req.params.referral;
  Referral.find({ referral: referral }).sort('-created').populate('user', 'displayName').exec(function (err, referrals) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(referrals);
    }
  });
};

/**
 * Referral middleware
 */
exports.referralByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Referral is invalid'
    });
  }

  Referral.findById(id).populate('user', 'displayName').exec(function (err, referral) {
    if (err) {
      return next(err);
    } else if (!referral) {
      return res.status(404).send({
        message: 'No referral with that identifier has been found'
      });
    }
    req.referral = referral;
    next();
  });
};
