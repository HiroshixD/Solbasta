'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  passport = require('passport'),
  User = mongoose.model('User'),
  Cuenta = mongoose.model('Cuenta'),
  Envio = mongoose.model('Datos_envio'),
  Referral = mongoose.model('Referral'),
  nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport('SMTP', {
  host: 'mail.disolu.com', // hostname
  secureConnection: true, // TLS requires secureConnection to be false
  port: 465, // port for secure SMTP
  auth: {
    user: 'informes@solbasta.com',
    pass: 'soluciones123'
  },
  debug: true,
  tls: {
    rejectUnauthorized: false
  }
});

// URLs for which user can't be redirected on signin
var noReturnUrls = [
  '/authentication/signin',
  '/authentication/signup'
];

/**
 * Signup
 */
exports.signup = function (req, res) {
  // For security measurement we remove the roles from the req.body object
  //  delete req.body.roles;

  // Init user and add missing fields
  var user = new User(req.body);
  user.provider = 'local';
  user.displayName = user.firstName + ' ' + user.lastName;

  // Then save the user
  user.save(function (err) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      exports.sendMail(user);
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;
      req.login(user, function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.json(user);

          var cuenta = new Cuenta();
          cuenta._id = user._id;
          cuenta.created = Date.now();
          cuenta.updated = Date.now();
          cuenta.monto = 0;
          cuenta.user = user._id;

          cuenta.save(function (err) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            }
          });

          var envio = new Envio();
          envio._id = user._id;
          envio.created = Date.now();
          envio.user = user._id;

          envio.save(function (err) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            }
          });

          var referido = new Referral();
          referido._id = user._id;
          referido.created = Date.now();
          referido.referral_nickname = user.username;
          //  referido.referral es el codigo del que refirió a este usuario
          referido.referral = user.referral;
          referido.referral_fullname = user.displayName;

          referido.save(function (err) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            }
          });
        }
      });
    }
  });
};


exports.sendMail = function(user) {
  var htmldata = '<head><meta charset="UTF-8"><link href="https://fonts.googleapis.com/css?family=OpenSans:400,700" rel="stylesheet" type="text/css"></head>' +
'<body><div style="font-family:"Open Sans", sans-serif; width: 75%; margin: 0 auto;"><div> <img src="http://i.imgur.com/iTnVO9T.jpg" width="230" height="60" style="display: block;"> </div> ' +
'<br><div> <img src="http://i.imgur.com/AaBoMTJ.jpg" width="100%" style="margin: 0 auto; display: block;"> </div>' +
'<br> ' +
'<div style="margin-top: 10px; line-height: 180%; text-align: center; color: black; font-size: 22px;">Bienvenid@ ' + user.firstName + '</div>' +
'<div style="display: block; width: 50px; background-color: #f4bb2e; height: 8px; margin: 10px auto;"></div> ' +
'<div style="margin-top: 10px; line-height: 180%; text-align: justify; color: black; font-weight: bold; font-style: italic; font-size: 24px;">¡Ahora eres parte de nuestra red de subastas!</div> ' +
'<div style="margin-top: 10px; line-height: 180%; text-align: justify; color: black; font-size: 20px;">Una web de subastas al centavo que te hará ganar los mejores productos, desde tan sólo un sol. Obteniendo lo que tanto querias a precios realmente increibles. ¡Ahora tu moneda valdrá más!</div> ' +
'<div style="margin-top: 10px; line-height: 180%; text-align: justify; color: black; font-weight: bold; font-style: italic; font-size: 21px;">Mantente atento(a) a nuestras novedades y recuerda:</div> ' +
'<div style="margin: 15px auto; width:280px; height:35px; background-color: #f4b424; text-align: center; border-radius: 22px 22px 22px 22px; -moz-border-radius: 22px 22px 22px 22px; -webkit-border-radius: 22px 22px 22px 22px; border: 0px solid #000000;"><a href="#" style="color: #000000; text-decoration: none; font-weight: normal; display: block; padding-top: 6px; font-size: 17px;">¡Has ganado 2 monedas!</a></div> ' +
'<div style="margin-top: 10px auto; line-height: 180%; text-align: center; color: black; font-size: 15px;">Para jugar gratis.!</div> ' +
'<div style="margin-top: 30px; line-height: 180%; text-align: center; color: #787a6b; font-size: 22px; font-weight: bold;">Pronto lanzamiento</div> ' +
'<div style="display: block; width: 200px; background-color: #f4bb2e; height: 8px; margin: 0px auto 10px auto;"></div> ' +
'<div style="margin-top: 10px; line-height: 180%; text-align: center; color: #787a6b; font-size: 18px; font-weight: bold;">Conócenos más en:</div> ' +
'<div style="display: block; width: 25px; background-color: #f4bb2e; height: 4px; margin: 0 auto;"></div> ' +
'<div style="width: 227px; margin: 0 auto; display: block; padding-top: 20px;"> ' +
'<a href="#"><img style="height: 45px;margin-right: 10px;" src="http://i.imgur.com/CMspk9Q.png"></a> ' +
'<a href="#"><img style="height: 45px;margin-right: 10px;" src="http://i.imgur.com/kZkVI7S.png"></a> ' +
'<a href="#"><img style="height: 45px;margin-right: 10px;" src="http://i.imgur.com/0OCT3Vd.png"></a> ' +
'<a href="#"><img style="height: 45px;"src="http://i.imgur.com/4ZfRXlB.png"></a> ' +
'</div> ' +
'<table border="0" width="100%" cellpadding="0" cellspacing="0"> ' +
'<tr> ' +
'<td style="background:none; border-bottom: 1px solid #f4bb2e; height:1px; width:100%; margin:0px 0px 0px 0px;">&nbsp;</td> ' +
'</tr> ' +
'</table> <br> ' +
'<div style="font-size: 0.9em;"> ' +
'<div style="text-align: center"> Solbasta S.A.C. Estás recibiendo este mensaje porque acabas de registrar tu correo en Solbasta.com</div> ' +
'</div> ' +
'</div> ' +
'</body>';

// setup e-mail data with unicode symbols
  var mailOptions = {
    from: 'Solbasta <informes@solbasta.com>', // sender address
    to: user.email, // list of receivers
    subject: 'Bienvenid@ ' + user.firstName, // Subject line
    html: htmldata // html body
  };

  smtpTransport.sendMail(mailOptions, function(error, info) {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: ' + info.response);
  });
};

/**
 * Signin after passport authentication
 */
exports.signin = function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err || !user) {
      res.status(400).send(info);
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      req.login(user, function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.json(user);
        }
      });
    }
  })(req, res, next);
};

/**
 * Signout
 */
exports.signout = function (req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * OAuth provider call
 */
exports.oauthCall = function (strategy, scope) {
  return function (req, res, next) {
    // Set redirection path on session.
    // Do not redirect to a signin or signup page
    if (noReturnUrls.indexOf(req.query.redirect_to) === -1) {
      req.session.redirect_to = req.query.redirect_to;
    }
    // Authenticate
    passport.authenticate(strategy, scope)(req, res, next);
  };
};

/**
 * OAuth callback
 */
exports.oauthCallback = function (strategy) {
  return function (req, res, next) {
    // Pop redirect URL from session
    var sessionRedirectURL = req.session.redirect_to;
    delete req.session.redirect_to;

    passport.authenticate(strategy, function (err, user, info) {
      if (err) {
        return res.redirect('/authentication/signin?err=' + encodeURIComponent(errorHandler.getErrorMessage(err)));
      }
      if (!user) {
        return res.redirect('/authentication/signin');
      }
      req.login(user, function (err) {
        if (err) {
          return res.redirect('/authentication/signin');
        }

        return res.redirect(info || sessionRedirectURL || '/');
      });
    })(req, res, next);
  };
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function (req, providerUserProfile, done) {
  if (!req.user) {
    // Define a search query fields
    var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
    var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

    // Define main provider search query
    var mainProviderSearchQuery = {};
    mainProviderSearchQuery.provider = providerUserProfile.provider;
    mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define additional provider search query
    var additionalProviderSearchQuery = {};
    additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define a search query to find existing user with current provider profile
    var searchQuery = {
      $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
    };

    User.findOne(searchQuery, function (err, user) {
      if (err) {
        return done(err);
      } else {
        if (!user) {
          var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

          User.findUniqueUsername(possibleUsername, null, function (availableUsername) {
            user = new User({
              firstName: providerUserProfile.firstName,
              lastName: providerUserProfile.lastName,
              username: availableUsername,
              displayName: providerUserProfile.displayName,
              email: providerUserProfile.email,
              profileImageURL: providerUserProfile.profileImageURL,
              provider: providerUserProfile.provider,
              providerData: providerUserProfile.providerData
            });

            // And save the user
            user.save(function (err) {
              return done(err, user);
            });
          });
        } else {
          return done(err, user);
        }
      }
    });
  } else {
    // User is already logged in, join the provider data to the existing user
    var user = req.user;

    // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
    if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
      // Add the provider data to the additional provider data field
      if (!user.additionalProvidersData) {
        user.additionalProvidersData = {};
      }

      user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

      // Then tell mongoose that we've updated the additionalProvidersData field
      user.markModified('additionalProvidersData');

      // And save the user
      user.save(function (err) {
        return done(err, user, '/settings/accounts');
      });
    } else {
      return done(new Error('User is already connected using this provider'), user);
    }
  }
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function (req, res, next) {
  var user = req.user;
  var provider = req.query.provider;

  if (!user) {
    return res.status(401).json({
      message: 'User is not authenticated'
    });
  } else if (!provider) {
    return res.status(400).send();
  }

  // Delete the additional provider
  if (user.additionalProvidersData[provider]) {
    delete user.additionalProvidersData[provider];

    // Then tell mongoose that we've updated the additionalProvidersData field
    user.markModified('additionalProvidersData');
  }

  user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.login(user, function (err) {
        if (err) {
          return res.status(400).send(err);
        } else {
          return res.json(user);
        }
      });
    }
  });
};
