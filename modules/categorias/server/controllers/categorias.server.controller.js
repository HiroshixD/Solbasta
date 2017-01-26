'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  fs = require('fs'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  Categoria = mongoose.model('Categoria'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an categoria
 */
exports.create = function (req, res) {
  var categoria = new Categoria(req.body);
  categoria.user = req.user;

  categoria.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(categoria);
    }
  });
};

/**
 * Show the current categoria
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var categoria = req.categoria ? req.categoria.toJSON() : {};

  // Add a custom field to the Categoria, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Categoria model.
  categoria.isCurrentUserOwner = !!(req.user && categoria.user && categoria.user._id.toString() === req.user._id.toString());

  res.json(categoria);
};

/**
 * Update an categoria
 */
exports.update = function (req, res) {
  var categoria = req.categoria;

  categoria.nombre = req.body.nombre;
  categoria.estado = req.body.estado;
  categoria.imageUrl = req.body.imageUrl;

  categoria.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(categoria);
    }
  });
};

/**
 * Delete an categoria
 */
exports.delete = function (req, res) {
  var categoria = req.categoria;

  categoria.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(categoria);
    }
  });
};

/**
 * List of Categorias
 */
exports.list = function (req, res) {
  Categoria.find().sort('-created').populate('user', 'displayName').exec(function (err, categorias) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(categorias);
    }
  });
};

/**
 * Categoria middleware
 */
exports.categoriaByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Categoria is invalid'
    });
  }

  Categoria.findById(id).populate('user', 'displayName').exec(function (err, categoria) {
    if (err) {
      return next(err);
    } else if (!categoria) {
      return res.status(404).send({
        message: 'No categoria with that identifier has been found'
      });
    }
    req.categoria = categoria;
    next();
  });
};

exports.uploadCategoryImage = function (req, res, next) {
  var user = req.user;
  var upload = multer(config.uploads.profileUpload).single('categoryPicture');
  var categoryUploadFileFilter = require(path.resolve('./config/lib/multer')).categoryUploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = categoryUploadFileFilter;

  upload(req, res, function(err) {
    var categoryId = req.body.id;
    Categoria.findById(categoryId).populate('user', 'displayName').exec(function (err, categoria) {
      if (err) {
        return next(err);
      } else if (!categoria) {
        return res.status(404).send({
          message: 'No categoria with that identifier has been found'
        });
      }
      if (categoria) {
        upload(req, res, function (uploadError) {
          if (uploadError) {
            return res.status(400).send({
              message: 'Ocurrió un error mientras subiamos la foto'
            });
          } else {
            categoria.imageURL = config.uploads.profileUpload.dest + req.file.filename;

            categoria.save(function (saveError) {
              if (saveError) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(saveError)
                });
              } else {
                req.login(user, function (err) {
                  if (err) {
                    res.status(400).send(err);
                  } else {
                    res.json(user);
                  }
                });
              }
            });
          }
        });
      } else {
        res.status(400).send({
          message: 'User is not signed in'
        });
      }
    });
  });
};
