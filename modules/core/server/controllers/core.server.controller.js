'use strict';

var validator = require('validator');

/**
 * Render the main application page
 */
exports.renderHomeIndex = function (req, res) {

  var safeUserObject = null;
  if (req.user) {
    safeUserObject = {
      _id: validator.escape(req.user.id),
      displayName: validator.escape(req.user.displayName),
      provider: validator.escape(req.user.provider),
      username: validator.escape(req.user.username),
      created: req.user.created.toString(),
      roles: req.user.roles,
      profileImageURL: req.user.profileImageURL,
      suscriptionState: req.user.suscriptionState,
      email: validator.escape(req.user.email),
      telefono: validator.escape(req.user.telefono),
      nacimiento: validator.escape(req.user.birthDate),
      docNumber: validator.escape(req.user.docNumber),
      referral: validator.escape(req.user.referral),
      referral_code: validator.escape(req.user.referral_code),
      lastName: validator.escape(req.user.lastName),
      firstName: validator.escape(req.user.firstName),
      additionalProvidersData: req.user.additionalProvidersData
    };
  }

  res.render('modules/core/server/views/index', {
    user: safeUserObject
  });
};

exports.renderAdminIndex = function (req, res) {
  var safeUserObject = null;
  //  Si existe el usuario
  if (req.user) {
    //  Si el usuario es un tipo "user"
    if (req.user.roles[0] === 'user') {
      res.redirect('/404');
      //  res.status(404).render('modules/core/server/views/404');
      //  res.redirect('/');
      res.status(404).render('modules/core/server/views/404');
    }
    safeUserObject = {
      //  Hiro Code Review
      _id: validator.escape(req.user.id),
      displayName: validator.escape(req.user.displayName),
      provider: validator.escape(req.user.provider),
      username: validator.escape(req.user.username),
      created: req.user.created.toString(),
      roles: req.user.roles,
      profileImageURL: req.user.profileImageURL,
      suscriptionState: req.user.suscriptionState,
      email: validator.escape(req.user.email),
      telefono: validator.escape(req.user.telefono),
      nacimiento: req.user.birthDate,
      docNumber: validator.escape(req.user.docNumber),
      referral_code: req.user.referral_code,
      lastName: validator.escape(req.user.lastName),
      firstName: validator.escape(req.user.firstName),
      additionalProvidersData: req.user.additionalProvidersData
    };

    res.render('modules/core/server/views/admin', {
      user: safeUserObject
    });

  } else {
    res.redirect('/');
  }
};

exports.renderSolBastaIndex = function (req, res) {

  var safeUserObject = null;
  if (req.user) {
    safeUserObject = {
      _id: validator.escape(req.user.id),
      displayName: validator.escape(req.user.displayName),
      provider: validator.escape(req.user.provider),
      username: validator.escape(req.user.username),
      created: req.user.created.toString(),
      roles: req.user.roles,
      profileImageURL: req.user.profileImageURL,
      suscriptionState: req.user.suscriptionState,
      email: validator.escape(req.user.email),
      telefono: validator.escape(req.user.telefono),
      nacimiento: req.user.birthDate,
      docNumber: validator.escape(req.user.docNumber),
      referral: validator.escape(req.user.referral),
      referral_code: req.user.referral_code,
      lastName: validator.escape(req.user.lastName),
      firstName: validator.escape(req.user.firstName),
      additionalProvidersData: req.user.additionalProvidersData
    };
  }

  res.render('modules/core/server/views/home', {
    user: safeUserObject
  });
};

exports.renderLandingIndex = function (req, res) {

  var safeUserObject = null;
  if (req.user) {
    safeUserObject = {
      _id: validator.escape(req.user.id),
      displayName: validator.escape(req.user.displayName),
      provider: validator.escape(req.user.provider),
      username: validator.escape(req.user.username),
      created: req.user.created.toString(),
      roles: req.user.roles,
      profileImageURL: req.user.profileImageURL,
      email: validator.escape(req.user.email),
      telefono: validator.escape(req.user.telefono),
      docNumber: validator.escape(req.user.docNumber),
      referral_code: validator.escape(req.user.referral_code),
      lastName: validator.escape(req.user.lastName),
      firstName: validator.escape(req.user.firstName),
      additionalProvidersData: req.user.additionalProvidersData
    };
  }

  res.render('modules/core/server/views/landing', {
    user: safeUserObject
  });
};
/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...'
  });
};

/*
* Config error 404
*/
exports.renderServerError404 = function (req, res) {
  res.status(404).render('modules/core/server/views/404', {
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};
