'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * User middleware
 */
exports.userByUsername = function(req, res, next, text) {
  var texto = req.params.text;
  User.find({ $and: [{ $or: [{ 'username': new RegExp(texto, 'i') }] }] }, function(err, users) {
    if (err) {
      console.log(err);
    }
    req.users = users;
    next();
  });
};

exports.userDataWinner = function(req, res) {
  var id = req.body.userdataid;
  User.find({ _id: id }, function(err, users) {
    if (err) {
      console.log(err);
    }
    res.json(users);
  }).select('_id displayName telefono email');
};

exports.userByReferralCode = function(req, res, next, code) {
  var codigo = req.params.code;
  User.find({ referral_code: codigo }, function(err, users) {
    if (err) {
      console.log(err);
    }
    req.users = users;
    next();
  }).select('_id');
};

exports.listUsernames = function(req, res) {
  res.json(req.users);
};

exports.manageSubscription = function(req, res) {
  // Init Variables
  var user = req.user._id;
  var state = req.user.suscriptionState;
  User.findOneAndUpdate({ _id: user }, { $set: { suscriptionState: !state } }, { new: true }, function(err, data) {
    if (err) {
      console.log("Something wrong when updating data!");
    }
    res.json(data.suscriptionState);
  });
};
