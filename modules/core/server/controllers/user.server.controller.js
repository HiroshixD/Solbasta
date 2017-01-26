'use strict';

var validator = require('validator');

exports.renderUserIndex = function (req, res) {

  var safeUserObject = null;
  //  si existe el usuario
  if (req.user) {

    //  si el usuario es un tipo "admin"
    if (req.user.roles[0] === 'admin') {
      res.redirect('/admin');
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
      email: validator.escape(req.user.email),
      lastName: validator.escape(req.user.lastName),
      firstName: validator.escape(req.user.firstName),
      additionalProvidersData: req.user.additionalProvidersData
    };

    res.render('modules/core/server/views/user', {
      user: safeUserObject
    });
  } else {
    res.redirect('/');
  }

};
