'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  moment = require('moment'),
  Detalle_subasta = mongoose.model('Detalle_subasta'),
  Transaccion = mongoose.model('Transaccion'),
  Cuenta = mongoose.model('Cuenta'),
  User = mongoose.model('User'),
  passport = require('passport'),
  sockets = require(path.resolve('./modules/homes/server/sockets/dashboard.server.config.js')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an detalle_subasta
 */
exports.create = function (req, res) {
  var quantity;
  Detalle_subasta.count({}).sort('-created').exec(function (err, qty) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      quantity = qty + 1;
      var detalle_subasta = new Detalle_subasta(req.body);
      detalle_subasta.user = req.user;
      detalle_subasta.start = req.body.fecha_inicio;
      detalle_subasta.numberid = quantity;

      detalle_subasta.save(function (err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(detalle_subasta);
        }
      });
    }
  });
};

/**
 * Show the current detalle_subasta
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var detalle_subasta = req.detalle_subasta ? req.detalle_subasta.toJSON() : {};

  // Add a custom field to the Detalle_subasta, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Detalle_subasta model.
  detalle_subasta.isCurrentUserOwner = !!(req.user && detalle_subasta.user && detalle_subasta.user._id.toString() === req.user._id.toString());

  res.json(detalle_subasta);
};

/**
 * Update an detalle_subasta
 */
exports.update = function (req, res) {
  var detalle_subasta = req.detalle_subasta;

  detalle_subasta.titulo = req.body.titulo;
  detalle_subasta.descripcion = req.body.descripcion;
  detalle_subasta.fecha_inicio = req.body.fecha_inicio;
  detalle_subasta.fecha_fin = req.body.fecha_fin;
  detalle_subasta.min_pujas = req.body.min_pujas;
  detalle_subasta.max_pujas = req.body.max_pujas;
  detalle_subasta.shipping = req.body.shipping;
  detalle_subasta.updated_at = Date.now();
  detalle_subasta.precio_vendido = req.body.precio_vendido;
  detalle_subasta.winner = req.body.winner;
  detalle_subasta.producto = req.body.producto;
  detalle_subasta.destacado = req.body.destacado;
  detalle_subasta.estado_envio = req.body.estado_envio;
  detalle_subasta.estado_pago = req.body.estado_pago;
  detalle_subasta.tipos = req.body.tipos;

  detalle_subasta.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(detalle_subasta);
    }
  });
};

// Subasta ya pagada y enviada
exports.payAndSend = function(req, res) {
  // Init Variables
  var idsubasta = req.body.idsubasta;
  Detalle_subasta.findOneAndUpdate({ _id: idsubasta }, { $set: { estado_pago: 1, estado_envio: 1 } }, { new: true }, function(err, data) {
    if (err) {
      console.log("Algo anda mal al actualizar la data!");
    }
    res.json(data._id);
  });
};


//  exports.auctionValidate = function(req, res) {
exports.updateTimer = function(req, res) {
  var data = req.body.userid;
  var usuario = req.user;
  var subasta = req.detalle_subasta;
  var idusuario = req.user._id;

  if (!req.user) {
    return res.status(400).send({
      message: 'El usuario no está logeado'
    });
  }
  //  Validacion de status
  Detalle_subasta.find({ '_id': subasta._id, estado: 1 }).exec(function (err, subastas) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    if (subastas.length === 0) {
      return res.status(400).send({
        message: 'Esta subasta ya terminó'
      });
    }

    Cuenta.find({ _id: idusuario }).exec(function (err, usuario) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      if (usuario[0].monto <= 0) {
        return res.status(400).send({
          message: 'NO TIENES SALDO SUFICIENTE PARA OFERTAR'
        });
      }
      console.log('Si tienes saldo suficiente');
      switch (true) {
        case req.detalle_subasta.tipos.revancha:
          revancha();
          break;
        case req.detalle_subasta.tipos.novato:
          novato();
          break;
        case req.detalle_subasta.tipos.estandar:
          estandar();
          break;
        case req.detalle_subasta.tipos.cumpleanero:
          cumpleanero();
          break;
        case req.detalle_subasta.tipos.menosveinte:
          menosveinte();
          break;
        case req.detalle_subasta.tipos.rapidita:
          rapidita();
          break;
        default:
          console.log('llamada funcion general de subastas');
      }
    });
  });
  return;
  //  Validacion rapidita

  //  Validacion Revancha
  function revancha() {
    console.log('la subasta es la revancha');
    Detalle_subasta.find({ 'winner': idusuario }).exec(function (err, revancha) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else if (revancha.length > 0) {
        return res.status(400).send({
          message: 'ÉSTA SUBASTA ES PARA QUIENES AÚN NO HAN GANADO NINGUNA SUBASTA'
        });
      } else {
        switch (true) {
          case subasta.tipos.novato:
            novato();
            break;
          case subasta.tipos.estandar:
            estandar();
            break;
          case subasta.tipos.cumpleanero:
            cumpleanero();
            break;
          case subasta.tipos.menosveinte:
            menosveinte();
            break;
          case subasta.tipos.rapidita:
            rapidita();
            break;
          default:
            puja();
        }
      }
    });
  }

  //  Validacion Novato
  function novato() {
    console.log('la subasta es novato');
    var diferencia = new Date() - new Date(usuario.created);
    if (diferencia > 604800000) {
      return res.status(400).send({
        message: 'ÉSTA SUBASTA ES PARA NOVATOS'
      });
    }

    switch (true) {
      case subasta.tipos.estandar:
        estandar();
        break;
      case subasta.tipos.cumpleanero:
        cumpleanero();
        break;
      case subasta.tipos.menosveinte:
        menosveinte();
        break;
      case subasta.tipos.rapidita:
        rapidita();
        break;
      default:
        puja();
    }
  }

  //  Validacion Todos juegan
  function estandar() {
    switch (true) {
      case subasta.tipos.menosveinte:
        menosveinte();
        break;
      case subasta.tipos.rapidita:
        rapidita();
        break;
      default:
        puja();
    }
  }
  //  Validacion Cumpleañero
  function cumpleanero() {
    var mes = new Date().getMonth();
    var mesusuario = new Date(usuario.birthDate).getMonth();
    if (mes !== mesusuario) {
      return res.status(400).send({
        message: 'ÉSTA SUBASTA ES PARA CUMPLEAÑEROS'
      });
    }

    switch (true) {
      case subasta.tipos.menosveinte:
        menosveinte();
        break;
      case subasta.tipos.rapidita:
        rapidita();
        break;
      default:
        puja();
    }

  }
  //  Validacion -20
  function menosveinte() {
    Cuenta.find({ _id: idusuario }).exec(function (err, usuario) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      if (usuario[0].monto >= 21) {
        return res.status(400).send({
          message: 'DEBES TENER 20 O MENOS SOLSAZOS PARA PODER OFERTAR AQUÍ'
        });
      }
      switch (true) {
        case subasta.tipos.rapidita:
          rapidita();
          break;
        default:
          puja();
      }
    });
  }

  function rapidita() {
    Transaccion.find({ 'subasta': subasta._id, 'user': idusuario }).exec(function (err, transacciones) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      console.log('CONTADOR DE PUJAS');
      console.log(transacciones.length);
      if (transacciones.length < 9) {
        puja(0);
      } else {
        puja(1);
      }
    });
  }

  function puja(statement) {
    var subasta = req.detalle_subasta;
    console.log(subasta);
    var userid = data.substring(0, 12) + data.substring(24, 36);
    var token = data.substring(12, 24);

    Transaccion.find({ 'transaccion_token': token }).exec(function (err, transaccions) {
      if (transaccions.length > 0) {
        exports.banForgeryUser(userid);
        req.logout();
        return res.status(400).send({
          message: 'user has been banned'
        });
      }
    });

    if (subasta.ultima_oferta !== null) {
      console.log('SUBASTA ULTIMA OFERTA ID: ' + subasta.ultima_oferta._id);
      console.log('USERID: ' + userid);
      if (subasta.ultima_oferta._id.toString() === userid.toString()) {
        return res.status(400).send({
          message: 'NO PUEDES PUJAR SOBRE TU ANTERIOR OFERTA'
        });
      }
    }

    var fechasubasta = new Date(moment(subasta.fecha_inicio).add(5, 'hours'));
    var ahora = new Date();
    var diferencia = moment(fechasubasta) - moment(ahora);

    if (diferencia < 10000) {
      subasta.fecha_inicio = moment(subasta.fecha_inicio, 'YYYY-MM-DD').add(10, 'seconds');
    }

    subasta.cant_pujas = subasta.cant_pujas + 1;
    subasta.ultima_oferta = userid;

    subasta.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        subasta.populate('ultima_oferta', 'username docNumber profileImageURL', function(err, data) {
          subasta.tiempo_restante = subasta.fecha_inicio - moment().add(-5, 'hours');
          res.json(data);
        });
      }
    });
    if (statement === 1) {
      console.log('el cliente ganador es: ' + subasta.ultima_oferta);
      var precio = subasta.cant_pujas / 100;
      var clientid = subasta.ultima_oferta._id;
      var fecha = moment().add(-5, 'hours');
      Detalle_subasta.findOneAndUpdate({ '_id': subasta._id }, { $set: { estado: 3, winner: subasta.ultima_oferta, precio_vendido: precio, fecha_fin: fecha } }, { new: true }).populate('producto', 'nombre imagenUrl precio_normal').populate('ultima_oferta').exec(function(err, data) {
        if (err) {
          console.log("Hubo un error al actualizar la data!");
        }
        sockets.winner(data);
      });
    }
    return;
  }

};

exports.banForgeryUser = function (id, res) {
  User.findOneAndUpdate({ '_id': id }, { $set: { status: 2 } }, { new: true }).exec(function(err, user) {
    if (user) {
      console.log('Usuario baneado');
    }
  });
};

exports.banUser = function (req, res) {
  var id = req.params.userId;
  User.findOneAndUpdate({ '_id': id }, { $set: { status: 2 } }, { new: true }).exec(function(err, user) {
    if (user) {
      res.json(user);
    }
  });
};

exports.unbanUser = function (req, res) {
  var id = req.params.userId;
  User.findOneAndUpdate({ '_id': id }, { $set: { status: 1 } }, { new: true }).exec(function(err, user) {
    if (user) {
      res.json(user);
    }
  });
};

exports.getAuctionByUserId = function (req, res) {
  var id = req.params.userId;
  Detalle_subasta.find({ 'winner': id }).exec(function (err, subastasByStatus) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(subastasByStatus);
    }
  });
};

exports.getAuctionSkipByUserId = function(req, res) {
  var id = req.body.idusuario;
  var skip = req.body.skip;
  Detalle_subasta.find({ 'winner': id }).skip(skip).limit(4).populate('producto', 'nombre imagenUrl precio_normal thumbnail_1 thumbnail_2 thumbnail_3').exec(function (err, subastasByStatus) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(subastasByStatus);
    }
  });
};

exports.updateType = function(req, res) {
  var detalle_subasta = req.detalle_subasta;
  detalle_subasta.estado = req.body.estado;

  detalle_subasta.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(detalle_subasta);
    }
  });
};
/**
 * Delete an detalle_subasta
 */
exports.delete = function (req, res) {
  var detalle_subasta = req.detalle_subasta;

  detalle_subasta.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(detalle_subasta);
    }
  });
};

/**
 * List of Detalle_subastas
 */
exports.list = function (req, res) {
  Detalle_subasta.find().sort('-created').limit(15).populate('user', 'displayName').populate('producto', 'nombre imagenUrl precio_normal thumbnail_1 thumbnail_2 thumbnail_3 descripcion_larga descripcion_corta').exec(function (err, detalle_subastas) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(detalle_subastas);
    }
  });
};

exports.listFeatured = function (req, res) {
  Detalle_subasta.find({ destacado: true }).sort('-created').limit(4).populate('user', 'displayName').populate('producto', 'nombre imagenUrl precio_normal thumbnail_1 thumbnail_2 thumbnail_3').exec(function (err, detalle_subastas) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(detalle_subastas);
    }
  });
};

exports.listForCategorie = function (req, res) {
  var auctionsProcess = [];
  var idcategorie = req.params.idcategorie;
  Detalle_subasta.find().sort('-created').populate('tipo_subasta', 'nro_tipo').populate('user', 'displayName').populate('producto', 'nombre imagenUrl precio_normal thumbnail_1 thumbnail_2 thumbnail_3 categoria', { categoria: idcategorie }).exec(function (err, detalle_subastas) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      for (var i = 0; i < detalle_subastas.length; i++) {
        detalle_subastas[i].tiempo_restante = detalle_subastas[i].fecha_inicio - moment().add(-5, 'hours');
        //  auctionsProcess.push(detalle_subastas[i], {"countdown": detalle_subastas[i].fecha_inicio});
        auctionsProcess.push(detalle_subastas[i]);
        // io.emit('updateLiveSocket', detalle_subastas[i].fecha_inicio);
        //  Enviamos cada dato encontrado al servidor para que se aplique el timer
      }
      res.json(auctionsProcess);
    }
  });
};

exports.listLastFifteen = function (req, res) {
  Detalle_subasta.find().sort('-created').populate('user', 'displayName').populate('producto', 'nombre imagenUrl precio_normal thumbnail_1 thumbnail_2 thumbnail_3').limit(15).exec(function (err, detalle_subastas) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(detalle_subastas);
    }
  });
};

exports.listForStatus = function (req, res) {
  var status = req.params.statusId;
  Detalle_subasta.find({ 'estado': status }).sort('fecha_inicio').populate('user', 'displayName').populate('producto', 'nombre imagenUrl precio_normal thumbnail_1 thumbnail_2 thumbnail_3').populate('tipo_subasta', 'nro_tipo').populate('ultima_oferta', 'username docNumber profileImageURL').exec(function (err, subastasByStatus) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(subastasByStatus);
    }
  });
};

exports.listForType = function (req, res) {
  var status = req.body.status;
  Detalle_subasta.find({ 'estado': status }).sort('fecha_inicio').populate('user', 'displayName').populate('producto', 'nombre imagenUrl precio_normal thumbnail_1 thumbnail_2 thumbnail_3').populate('tipo_subasta', 'nro_tipo').populate('ultima_oferta', 'username docNumber profileImageURL displayName docNumber telefono').exec(function (err, subastasByStatus) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(subastasByStatus);
    }
  });
};

exports.threeMonths = function(req, res) {
  var today = new Date(moment().add(-5, 'hours'));
  var monththree = new Date(moment().add(-3, 'months').add(-5, 'hours'));
  Detalle_subasta.find({
    fecha_inicio: { $gte: monththree, $lt: today }, 'estado': 3 }).sort('-created').populate('user', 'displayName').populate('producto', 'nombre imagenUrl precio_normal thumbnail_1 thumbnail_2 thumbnail_3').exec(function (err, detalle_subastas) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        //  res.json(today);
        res.json(detalle_subastas);
      }
    });
};

exports.sixMonths = function(req, res) {
  var today = new Date(moment().add(-5, 'hours'));
  var monththree = new Date(moment().add(-6, 'months').add(-5, 'hours'));
  Detalle_subasta.find({
    fecha_inicio: { $gte: monththree, $lt: today }, 'estado': 3 }).sort('-created').populate('user', 'displayName').populate('producto', 'nombre imagenUrl precio_normal thumbnail_1 thumbnail_2 thumbnail_3').exec(function (err, detalle_subastas) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
      //  res.json(today);
        res.json(detalle_subastas);
      }
    });
};

exports.customizedSearch = function(req, res, next, text) {
  var texto = req.params.text;
  Detalle_subasta.find({ $and: [{ $or: [{ 'titulo': new RegExp(texto, 'i') }] }], estado: 3 }, function(err, subastas) {
    if (err) {
      console.log(err);
    }
    req.subastas = subastas;
    next();
  }).populate('producto', 'nombre imagenUrl precio_normal thumbnail_1 thumbnail_2 thumbnail_3').populate('ultima_oferta', 'username');
};

exports.listData = function(req, res) {
  res.json(req.subastas);
};

//  Aqui procesamos las subastitas
exports.listAuctionsAndProcess = function (req, res) {
  var status = req.params.auctionStatus;
  var auctionsProcess = [];
  var now = new Date(moment().add(-5, 'hours'));
  Detalle_subasta.find({ estado: status }).sort('fecha_inicio').populate('user', 'displayName').populate('producto', 'nombre imagenUrl precio_normal thumbnail_1 thumbnail_2 thumbnail_3').populate('tipo_subasta', 'nro_tipo').populate('ultima_oferta').exec(function (err, detalle_subastas) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      for (var i = 0; i < detalle_subastas.length; i++) {
        detalle_subastas[i].tiempo_restante = detalle_subastas[i].fecha_inicio - moment().add(-5, 'hours');
        //  auctionsProcess.push(detalle_subastas[i], {"countdown": detalle_subastas[i].fecha_inicio});
        auctionsProcess.push(detalle_subastas[i]);
       // io.emit('updateLiveSocket', detalle_subastas[i].fecha_inicio);
      //  Enviamos cada dato encontrado al servidor para que se aplique el timer
      }
      res.json(auctionsProcess);
    }
  });
};

exports.listFiveAuctionsAndProcess = function (req, res) {
  var status = req.params.auctionId;
  var auctionsProcess = [];
  var now = new Date(moment().add(-5, 'hours'));
  Detalle_subasta.find({ estado: status }).sort('fecha_inicio').limit(5).populate('user', 'displayName').populate('producto', 'nombre imagenUrl precio_normal thumbnail_1 thumbnail_2 thumbnail_3').populate('tipo_subasta', 'nro_tipo').populate('ultima_oferta').exec(function (err, detalle_subastas) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      for (var i = 0; i < detalle_subastas.length; i++) {
        detalle_subastas[i].tiempo_restante = detalle_subastas[i].fecha_inicio - moment().add(-5, 'hours');
        //  auctionsProcess.push(detalle_subastas[i], {"countdown": detalle_subastas[i].fecha_inicio});
        auctionsProcess.push(detalle_subastas[i]);
       // io.emit('updateLiveSocket', detalle_subastas[i].fecha_inicio);
      //  Enviamos cada dato encontrado al servidor para que se aplique el timer
      }
      res.json(auctionsProcess);
    }
  });
};

exports.getNext5 = function (req, res) {
  var auctionsProcess = [];
  var now = new Date(moment().add(-5, 'hours'));
  Detalle_subasta.find({ estado: 2 }).sort('fecha_inicio').populate('user', 'displayName').populate('producto', 'nombre imagenUrl precio_normal thumbnail_1 thumbnail_2 thumbnail_3').populate('tipo_subasta', 'nro_tipo').populate('ultima_oferta').limit(5).exec(function (err, detalle_subastas) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      for (var i = 0; i < detalle_subastas.length; i++) {
        detalle_subastas[i].tiempo_restante = detalle_subastas[i].fecha_inicio - moment().add(-5, 'hours');
        //  auctionsProcess.push(detalle_subastas[i], {"countdown": detalle_subastas[i].fecha_inicio});
        auctionsProcess.push(detalle_subastas[i]);
       // io.emit('updateLiveSocket', detalle_subastas[i].fecha_inicio);
      //  Enviamos cada dato encontrado al servidor para que se aplique el timer
      }
      res.json(auctionsProcess);
    }
  });
};

exports.getNext = function (req, res) {
  var auctionsProcess = [];
  var now = new Date(moment().add(-5, 'hours'));
  Detalle_subasta.find({ estado: 2 }).sort('fecha_inicio').populate('user', 'displayName').populate('producto', 'nombre imagenUrl precio_normal thumbnail_1 thumbnail_2 thumbnail_3').populate('tipo_subasta', 'nro_tipo').populate('ultima_oferta').exec(function (err, detalle_subastas) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      for (var i = 0; i < detalle_subastas.length; i++) {
        detalle_subastas[i].tiempo_restante = detalle_subastas[i].fecha_inicio; - moment().add(-5, 'hours');
        //  auctionsProcess.push(detalle_subastas[i], {"countdown": detalle_subastas[i].fecha_inicio});
        auctionsProcess.push(detalle_subastas[i]);
       // io.emit('updateLiveSocket', detalle_subastas[i].fecha_inicio);
      //  Enviamos cada dato encontrado al servidor para que se aplique el timer
      }
      res.json(auctionsProcess);
    }
  });
};

exports.readforStatus = function (req, res) {
  // convert mongoose document to JSON
  var subastasByStatus = req.subastasByStatus ? req.subastasByStatus.toJSON() : {};
  // Add a custom field to the Detalle_subasta, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Detalle_subasta model.
  subastasByStatus.isCurrentUserOwner = !!(req.user && subastasByStatus.user && subastasByStatus.user._id.toString() === req.user._id.toString());

  res.json(subastasByStatus);
};

exports.readListAuctionsAndProcess = function (req, res) {
  // convert mongoose document to JSON
  var auctionsProcess = req.auctionsProcess ? req.auctionsProcess.toJSON() : {};
  // Add a custom field to the Detalle_subasta, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Detalle_subasta model.
  auctionsProcess.isCurrentUserOwner = !!(req.user && auctionsProcess.user && auctionsProcess.user._id.toString() === req.user._id.toString());

  res.json(auctionsProcess);
};

/**
 * Detalle_subasta middleware
 */
exports.detalle_subastaByID = function (req, res, next, id) {
  var resultado;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'La subasta es inválida'
    });
  }

  Detalle_subasta.findById(id).populate('user', 'displayName').populate('producto', 'nombre imagenUrl precio_normal thumbnail_1 thumbnail_2 thumbnail_3 descripcion_larga descripcion_corta especificaciones youtube_url').populate('winner', 'username docNumber firstName lastName').populate('tipo_subasta', 'nro_tipo').populate('ultima_oferta', 'username docNumber profileImageURL').exec(function (err, detalle_subasta) {
    if (err) {
      return next(err);
    } else if (!detalle_subasta) {
      return res.status(404).send({
        message: 'No se encontró ninguna subasta con ese identificador'
      });
    }

    resultado = detalle_subasta.fecha_inicio - moment().add(-5, 'hours');
    if (resultado < 0) {
      detalle_subasta.tiempo_restante = 0;
    } else {
      detalle_subasta.tiempo_restante = resultado;
    }
    req.detalle_subasta = detalle_subasta;
    next();
  });
};
