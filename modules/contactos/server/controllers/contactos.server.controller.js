'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Contacto = mongoose.model('Contacto'),
  nodemailer = require('nodemailer'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

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

exports.sendMail = function(data) {
  var htmldata = '<p>Hola Administrador, ésta es una notificación automatica sobre el formulario de contacto</p>' +
  '<p><b>Nombre: </b> ' + data.nombres + '</p>' +
  '<p><b>Username: </b> ' + data.username + '</p>' +
  '<p><b>Email: </b> ' + data.email + '</p>' +
  '<p><b>Tema: </b> ' + data.tema + '</p>' +
  '<p><b>Asunto: </b> ' + data.asunto + '</p>' +
  '<p><b>Mensaje: </b> ' + data.mensaje + '</p>' +
  '<p><b>Si deseas responder a esta duda ingresa a tu cuenta de solbasta en modo administrador y ve al panel de Mensajes de contacto</b></p>';

// setup e-mail data with unicode symbols
  var mailOptions = {
    from: 'Solbasta Auctions <informes@solbasta.com>', // sender address
    to: 'hpalacios@smartrix.pe', // list of receivers
    subject: 'Han usado el formulario de contacto', // Subject line
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
 * Create an contacto
 */
exports.create = function (req, res) {
  var contacto = new Contacto(req.body);
  contacto.user = req.user;

  contacto.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      exports.sendMail(contacto);
      res.json(contacto);
    }
  });
};

/**
 * Show the current contacto
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var contacto = req.contacto ? req.contacto.toJSON() : {};

  // Add a custom field to the Contacto, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Contacto model.
  contacto.isCurrentUserOwner = !!(req.user && contacto.user && contacto.user._id.toString() === req.user._id.toString());

  res.json(contacto);
};

/**
 * Update an contacto
 */
exports.update = function (req, res) {
  var contacto = req.contacto;

  contacto.nombres = req.body.nombres;
  contacto.username = req.body.username;
  contacto.email = req.body.email;
  contacto.tema = req.body.tema;
  contacto.asunto = req.body.asunto;
  contacto.mensaje = req.body.mensaje;
  contacto.respuesta = req.body.respuesta;
  contacto.estado = req.body.estado;

  contacto.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(contacto);
    }
  });
};

/**
 * Delete an contacto
 */
exports.delete = function (req, res) {
  var contacto = req.contacto;

  contacto.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(contacto);
    }
  });
};

/**
 * List of Contactos
 */
exports.list = function (req, res) {
  Contacto.find().sort('-created').populate('user', 'displayName').exec(function (err, contactos) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(contactos);
    }
  });
};

/**
 * Contacto middleware
 */
exports.contactoByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Contacto is invalid'
    });
  }

  Contacto.findById(id).populate('user', 'displayName').exec(function (err, contacto) {
    if (err) {
      return next(err);
    } else if (!contacto) {
      return res.status(404).send({
        message: 'No contacto with that identifier has been found'
      });
    }
    req.contacto = contacto;
    next();
  });
};
