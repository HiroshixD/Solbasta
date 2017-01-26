'use strict';

/**
 * Module dependencies
 */
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  User = require('mongoose').model('User');

module.exports = function () {
  // Use local strategy
  passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  function (username, password, done) {
    User.findOne({
      $or: [{ 'username': username.toLowerCase() }, { 'email': username.toLowerCase() }]
    }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user || !user.authenticate(password)) {
        return done(null, false, {
          message: 'Error en usuario o contraseña'
        });
      } else if (user.status === 2) {
        return done(null, false, {
          message: 'TU CUENTA HA SIDO BANEADA PERMANETEMENTE'
        });
      }

      return done(null, user);
    });
  }));
};
