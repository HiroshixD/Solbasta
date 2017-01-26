  'use strict';
  var path = require('path'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    Reminder = mongoose.model('Reminder'),
    objectId = require('mongoose').Types.ObjectId,
    Subasta = mongoose.model('Detalle_subasta'),
    nodemailer = require('nodemailer'),
    passport = require('passport'),
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


// Create the chat configuration
  module.exports = function (io, socket) {
//	2- Enviamos la data a todos los conectados al socket
    module.exports.toLive = function(data) {
      io.emit('pushToLive', data);
    };

    module.exports.winner = function(data) {
      io.emit('winner', data);
    };

    module.exports.fifty = function(data) {
      io.emit('fifty', data);
    };

    socket.on('updateLiveSocket', function(data) {
      io.emit('updateLiveSocket', data);
    });

    socket.on('singleAuction', function(data) {
      io.emit('singleAuction', data);
    });

    socket.on('authenticated', function() {
      io.emit('authenticated');
    });

    socket.on('updateArray', function(data) {
      io.emit('updateArray', data);
    });

    socket.on('Notifications', function(data) {
      io.emit('Notifications', data);
    });
  };

  module.exports.getAllAuctions = function(req, res) {
    var array = [1, 2];
    Subasta.find({ estado: { $in: array } }).sort('-created').exec(function (err, detalle_subastas) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        for (var i = 0; i < detalle_subastas.length; i++) {
          module.exports.timerCountDown(detalle_subastas[i].fecha_inicio, detalle_subastas[i]._id);
        }
      }
    });
  };

  module.exports.listReminders = function (auctionid, res) {
    Reminder.find({ subasta: objectId(auctionid) }).sort('-created').populate('user', 'displayName email').exec(function (err, reminders) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        module.exports.send(reminders);
      }
    });
  };

  module.exports.send = function(reminders) {
    for (var i = 0; i < reminders.length; i++) {
      console.log(reminders[i].user.email);
      exports.sendMail(reminders[i].user);
    }
  };

  exports.sendMail = function(user) {
    var htmldata = 'Hola, Falta una hora para que tu subasta empiece';

// setup e-mail data with unicode symbols
    var mailOptions = {
      from: 'Solbasta Auctions <informes@solbasta.com>', // sender address
      to: user.email, // list of receivers
      subject: 'Hola ' + user.displayName + ' tu oferta está a punto de empezar', // Subject line
      html: htmldata // html body
    };

    smtpTransport.sendMail(mailOptions, function(error, info) {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: ' + info.response);
    });
  };

  //  Definimos el timer desde su propia creación
  module.exports.timerCountDown = function(startDate, idsubasta) {
    //  inicializamos las variables, segundo, hora, día y calculamos
    var _second = 1000,
      _minute = _second * 60,
      _hour = _minute * 60,
      _day = _hour * 24,
      timer = [];
    function showRemaining() {
      var end = new Date(startDate);
      var now = new Date(moment().add(-5, 'hours'));
      var duration = end - now + 1300;
      if (duration < 0) {
        Subasta.findOne({ '_id': idsubasta }).populate('producto', 'nombre imagenUrl precio_normal').populate('ultima_oferta').exec(function(err, subasta) {
          if (subasta) {
            var subastatimer = moment(subasta.fecha_inicio).add(5, 'hours').format('YYYY-MM-DD hh:mm:ss');
            var subastatimerminussec = moment(subasta.fecha_inicio).add(5, 'hours').add(1, 'second').format('YYYY-MM-DD hh:mm:ss');
            var server = moment().format('YYYY-MM-DD hh:mm:ss');

            if (subastatimer === server || subastatimerminussec === server) {
              finishAuction(subasta);
            } if (server >= subastatimerminussec && subasta.ultima_oferta == null) {
              finishAuctionWithoutWinner(subasta);
            }
          }
        });
        //  console.log('Tiempo terminado =)');
        return;
      }

      function finishAuction(subasta) {
        console.log('el cliente ganador es: ' + subasta.ultima_oferta.username);
        var precio = subasta.cant_pujas / 100;
        var clientid = subasta.ultima_oferta._id;
        var fecha = moment().add(-5, 'hours');
        if (subasta.estado === 1) {
          Subasta.findOneAndUpdate({ '_id': idsubasta }, { $set: { estado: 3, winner: clientid, precio_vendido: precio, fecha_fin: fecha } }, { new: true }).populate('producto', 'nombre imagenUrl precio_normal').populate('ultima_oferta').exec(function(err, data) {
            if (err) {
              console.log("Hubo un error al actualizar la data!");
            }
            module.exports.winner(data);
            clearInterval(timer[idsubasta]);
          });
        }
        clearInterval(timer[idsubasta]);
      }

      function finishAuctionWithoutWinner(subasta) {
        console.log('No hay cliente ganador');
        var precio = 0;
        var clientid = "Sin Ganador";
        var fecha = moment().add(-5, 'hours');
        if (subasta.estado === 1) {
          Subasta.findOneAndUpdate({ '_id': idsubasta }, { $set: { estado: 3, precio_vendido: precio, fecha_fin: fecha } }, { new: true }).populate('producto', 'nombre imagenUrl precio_normal').populate('ultima_oferta').exec(function(err, data) {
            if (err) {
              console.log("Hubo un error al actualizar la data!");
            }
            module.exports.winner(data);
            clearInterval(timer[idsubasta]);
          });
        }
        clearInterval(timer[idsubasta]);
      }
      var days = Math.floor(duration / _day);
      var hours = Math.floor((duration % _day) / _hour);
      var minutes = Math.floor((duration % _hour) / _minute);
      var seconds = Math.floor((duration % _minute) / _second);
      var comprobate = false;

      //  Condicional de envio de correos si falta mas de un dia y una hora
      while (days === 1 && hours === 1 && minutes === 0 && seconds === 0) {
        module.exports.listReminders(idsubasta);
        comprobate = true;
        if (comprobate === true) {
          break;
        }
      }


      //  Cambio de estado de subasta despues de 24 horas
      while (days === 0 && hours === 23 && minutes === 59 && seconds === 59) {
        console.log('Api disparada para id: ' + idsubasta);
        Subasta.findOneAndUpdate({ '_id': idsubasta }, { $set: { estado: 1 } }, { new: true }).populate('producto', 'nombre imagenUrl precio_normal').exec(function(err, subasta) {
          if (subasta) {
            subasta.tiempo_restante = subasta.fecha_inicio - moment().add(-5, 'hours');
            console.log('estado de subasta cambiado');
            module.exports.toLive(subasta);
          }
        });
        comprobate = true;
        if (comprobate === true) {
          break;
        }
      }


      //  Condicional de aviso para 15 minutos faltantes
      while (days === 0 && hours === 0 && minutes === 15 && seconds === 0) {
        module.exports.fifty('Faltan 15 minutos para inicializar la subasta');
        comprobate = true;
        if (comprobate === true) {
          break;
        }
      }

      console.log(days + 'Días ' + hours + 'horas ' + minutes + 'minutos ' + seconds + 'segundos');
    }

    timer[idsubasta] = setInterval(showRemaining, 1000);

    function cancelInterval(idsubasta) {
      if (timer[idsubasta]) {
        clearInterval(timer[idsubasta]);
      }
    }
  };

  module.exports.getNextAuctions = function(req, res) {
    var id = req.params.auction;
    Subasta.find({ _id: id }).sort('fecha_inicio').populate('user', 'displayName').populate('producto', 'nombre imagenUrl precio_normal').exec(function (err, detalle_subastas) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json("enviado");
        for (var i = 0; i < detalle_subastas.length; i++) {
         // io.emit('updateLiveSocket', detalle_subastas[i].fecha_inicio);
        //  Enviamos cada dato encontrado al servidor para que se aplique el timer
        //  console.log('la fecha de inicio del item es:' + detalle_subastas[i].fecha_inicio);
          module.exports.timerCountDown(detalle_subastas[i].fecha_inicio, detalle_subastas[i]._id);

        }
      }
    });
  };

  module.exports.timeWatcher = function() {
    console.log('timewatcher on');
    console.log('                                          .-....-.');
    console.log('                                       .-.        .-..');
    console.log('                                    .-.    -./\\.-    .-.');
    console.log('                                        -.  /_|\\  .-');
    console.log('                                    .-.   ./____\\.   .-..');
    console.log('                                 .-.    -./.-""-.\\.-      .');
    console.log('                                    .-.  /< (()) >\\  .-.');
    console.log('                                  -   ../__.-..-.__\\.   .-');
    console.log('                                ,....-./___|____|___\\.-..,.');
    console.log('                                   ,-.   ,. . . .,   .-,');
    console.log('                                ,-.   ________________  .-,');
    console.log('                                   ,./____|_____|_____\\');
    console.log('                                  / /__|_____|_____|___\\');
    console.log('                                 / /|_____|_____|_____|_\\');
    console.log('                                . /____|_____|_____|_____\\');
    console.log('                              .. /__|_____|_____|_____|___\\');
    console.log('                             ,. /|_____|_____|_____|_____|_\\');
    console.log(',,---..--...___...--...--.. /../____|_____|_____|_____|_____\\ ..--...--...___...--..---,,');
    console.log('                           .../__|_____|_____|_____|_____|___\\');
    console.log('      \\    )              ..:/|_____|_____|_____|_____|_____|_\\               (    /');
    console.log('      )\\  / )           ,.:./____|_____|_____|_____|_____|_____\\             ( \\  /(');
    console.log('     / / ( (           /:../__|_____|_____|_____|_____|_____|___\\             ) ) \\ \\');
    console.log('    | |   \\ \\         /.../|_____|_____|_____|_____|_____|_____|_\\           / /   | |');
    console.log(' .-.\\ \\    \\ \\       ...:/____|_____|_____|_____|_____|_____|_____\\         / /    / /.-.');
    console.log('(=  )\\ .._.. |       \\:./ _  _ ___  ____ ____ _    _ _ _ _ _  _ ___\\        | .._.. /(  =)');
    console.log(' \\ (_)       )       \\./  |\\/| |__) |___ |___ |___ _X_ _X_  \\/  _|_ \\       (       (_) /');
    console.log('  \\    .----.         """"""""""""""""""""""""""""""""""""""""""""""""       .----.    /');
    console.log('   \\   ____\\__                                                              __/____   /');
    console.log('    \\ (=\\     \\                                                            /     /-) /');
    console.log('     \\_)_\\     \\                      H I R O S H I                      /     /_(_/');
    console.log('          \\     \\                                                        /     /');
    console.log('           )     )  _                                                _  (     (');
    console.log('          (     (,-. .-..__                                    __..-. .-,)     )');
    console.log('           \\_.-..          ..-..____                  ____..-..          ..-._/');
    console.log('            .-._                    ..--...____...--..                    _.-.');
    console.log('                .-.._                                                _..-.');
    console.log('                     .-..__                                     __..-.');
    console.log('                           ..-..____                  ____..-..');
    console.log('                                    ..--...____...--..');
    console.log(moment().add(-5, 'hours').format('YYYY-MM-DD hh:mm:ss'));
  };
  module.exports.timeWatcher();
  module.exports.getAllAuctions();
