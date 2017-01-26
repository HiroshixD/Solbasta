'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  _ = require('lodash'),
  fs = require('fs'),
  mongoose = require('mongoose'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  Producto = mongoose.model('Producto'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an producto
 */
exports.create = function (req, res) {
  var producto = new Producto(req.body);
  producto.user = req.user;

  producto.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(producto);
    }
  });
};

/**
 * Show the current producto
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var producto = req.producto ? req.producto.toJSON() : {};

  // Add a custom field to the Producto, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Producto model.
  producto.isCurrentUserOwner = !!(req.user && producto.user && producto.user._id.toString() === req.user._id.toString());

  res.json(producto);
};

/**
 * Update an producto
 */
exports.update = function (req, res) {
  var producto = req.producto;

  producto.nombre = req.body.nombre;
  producto.precio_normal = req.body.precio_normal;
  producto.precio_oferta = req.body.precio_oferta;
  producto.nombre_display = req.body.nombre_display;
  producto.descripcion_larga = req.body.descripcion_larga;
  producto.descripcion_corta = req.body.descripcion_corta;
  producto.especificaciones = req.body.especificaciones;
  producto.categoria = req.body.categoria;
  producto.marca = req.body.marca;
  producto.tags = req.body.tags;
  producto.imageUrl = req.body.imageUrl;
  producto.thumbnail = req.body.thumbnail;
  producto.update = Date.now;
  producto.subasta_slider1 = req.body.subasta_slider1;
  producto.subasta_slider2 = req.body.subasta_slider2;
  producto.subasta_slider3 = req.body.subasta_slider3;
  producto.subasta_slider4 = req.body.subasta_slider4;
  producto.youtube_url = req.body.youtube_url;


  producto.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(producto);
    }
  });
};

exports.updateThumbnail_1 = function (req, res) {
  var producto = req.producto;
  var upload = multer(config.uploads.productUpload).single('newThumbnailPicture');
  var thumbnailUploadFileFilter = require(path.resolve('./config/lib/multer')).thumbnailUploadFileFilter;

  upload.fileFilter = thumbnailUploadFileFilter;

  if (producto) {
    upload(req, res, function (uploadError) {
      if (uploadError) {
        return res.status(400).send({
          message: 'Ocurrió un error al subir la imagen'
        });
      } else {
        producto.thumbnail_1 = config.uploads.productUpload.dest + req.file.filename;

        producto.save(function (err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(producto);
          }
        });
      }

    });
  }
};

exports.updateThumbnail_2 = function (req, res) {
  var producto = req.producto;
  var upload = multer(config.uploads.productUpload).single('newThumbnailPicture');
  var thumbnailUploadFileFilter = require(path.resolve('./config/lib/multer')).thumbnailUploadFileFilter;

  upload.fileFilter = thumbnailUploadFileFilter;

  if (producto) {
    upload(req, res, function (uploadError) {
      if (uploadError) {
        return res.status(400).send({
          message: 'Ocurrió un error al subir la imagen'
        });
      } else {
        producto.thumbnail_2 = config.uploads.productUpload.dest + req.file.filename;

        producto.save(function (err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(producto);
          }
        });
      }

    });
  }
};

exports.updateThumbnail_3 = function (req, res) {
  var producto = req.producto;
  var upload = multer(config.uploads.productUpload).single('newThumbnailPicture');
  var thumbnailUploadFileFilter = require(path.resolve('./config/lib/multer')).thumbnailUploadFileFilter;

  upload.fileFilter = thumbnailUploadFileFilter;

  if (producto) {
    upload(req, res, function (uploadError) {
      if (uploadError) {
        return res.status(400).send({
          message: 'Ocurrió un error al subir la imagen'
        });
      } else {
        producto.thumbnail_3 = config.uploads.productUpload.dest + req.file.filename;

        producto.save(function (err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(producto);
          }
        });
      }

    });
  }
};

exports.updateImagenUrl = function (req, res) {
  var producto = req.producto;
  var upload = multer(config.uploads.productUpload).single('newThumbnailPicture');
  var thumbnailUploadFileFilter = require(path.resolve('./config/lib/multer')).thumbnailUploadFileFilter;

  upload.fileFilter = thumbnailUploadFileFilter;

  if (producto) {
    upload(req, res, function (uploadError) {
      if (uploadError) {
        return res.status(400).send({
          message: 'Ocurrió un error al subir la imagen'
        });
      } else {
        producto.imagenUrl = config.uploads.productUpload.dest + req.file.filename;

        producto.save(function (err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(producto);
          }
        });
      }

    });
  }
};


exports.updateThumbnail_1_mobil = function (req, res) {
  var producto = req.producto;
  var upload = multer(config.uploads.productUpload).single('newThumbnailPicture');
  var thumbnailUploadFileFilter = require(path.resolve('./config/lib/multer')).thumbnailUploadFileFilter;

  upload.fileFilter = thumbnailUploadFileFilter;

  if (producto) {
    upload(req, res, function (uploadError) {
      if (uploadError) {
        return res.status(400).send({
          message: 'Ocurrió un error al subir la imagen'
        });
      } else {
        producto.thumbnail_1_mobil = config.uploads.productUpload.dest + req.file.filename;

        producto.save(function (err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(producto);
          }
        });
      }

    });
  }
};

exports.updateThumbnail_2_mobil = function (req, res) {
  var producto = req.producto;
  var upload = multer(config.uploads.productUpload).single('newThumbnailPicture');
  var thumbnailUploadFileFilter = require(path.resolve('./config/lib/multer')).thumbnailUploadFileFilter;

  upload.fileFilter = thumbnailUploadFileFilter;

  if (producto) {
    upload(req, res, function (uploadError) {
      if (uploadError) {
        return res.status(400).send({
          message: 'Ocurrió un error al subir la imagen'
        });
      } else {
        producto.thumbnail_2_mobil = config.uploads.productUpload.dest + req.file.filename;

        producto.save(function (err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(producto);
          }
        });
      }

    });
  }
};

exports.updateThumbnail_3_mobil = function (req, res) {
  var producto = req.producto;
  var upload = multer(config.uploads.productUpload).single('newThumbnailPicture');
  var thumbnailUploadFileFilter = require(path.resolve('./config/lib/multer')).thumbnailUploadFileFilter;

  upload.fileFilter = thumbnailUploadFileFilter;

  if (producto) {
    upload(req, res, function (uploadError) {
      if (uploadError) {
        return res.status(400).send({
          message: 'Ocurrió un error al subir la imagen'
        });
      } else {
        producto.thumbnail_3_mobil = config.uploads.productUpload.dest + req.file.filename;

        producto.save(function (err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(producto);
          }
        });
      }

    });
  }
};

exports.updateImagenUrl_mobil = function (req, res) {
  var producto = req.producto;
  var upload = multer(config.uploads.productUpload).single('newThumbnailPicture');
  var thumbnailUploadFileFilter = require(path.resolve('./config/lib/multer')).thumbnailUploadFileFilter;

  upload.fileFilter = thumbnailUploadFileFilter;

  if (producto) {
    upload(req, res, function (uploadError) {
      if (uploadError) {
        return res.status(400).send({
          message: 'Ocurrió un error al subir la imagen'
        });
      } else {
        producto.imagenUrl_mobil = config.uploads.productUpload.dest + req.file.filename;

        producto.save(function (err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(producto);
          }
        });
      }

    });
  }
};
/**
 * Delete an producto
 */
exports.delete = function (req, res) {
  var producto = req.producto;

  producto.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(producto);
    }
  });
};

/**
 * List of Productos
 */
exports.list = function (req, res) {
  Producto.find({ status: 1 }).sort('-created').populate('categoria', 'nombre').populate('marca', 'nombre').populate('user', 'displayName').exec(function (err, productos) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(productos);
    }
  });
};

exports.listSliders = function (req, res) {
  Producto.find({ status: 0 }).sort('-created').populate('categoria', 'nombre').populate('marca', 'nombre').populate('user', 'displayName').exec(function (err, productos) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(productos);
    }
  });
};

/**
 * Producto middleware
 */
exports.productoByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Producto is invalid'
    });
  }

  Producto.findById(id).populate('user', 'displayName').populate('marca', 'nombre').populate('categoria', 'nombre').exec(function (err, producto) {
    if (err) {
      return next(err);
    } else if (!producto) {
      return res.status(404).send({
        message: 'No producto with that identifier has been found'
      });
    }
    req.producto = producto;
    next();
  });
};

