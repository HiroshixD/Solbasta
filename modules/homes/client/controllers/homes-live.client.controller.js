(function () {
  'use strict';

  angular
    .module('homes')
    .controller('HomesLive', HomesLive);

  HomesLive.$inject = ['$rootScope', '$http', '$interval', '$scope', '$state', 'HomesService', 'Authentication', 'Detalle_subastasService', '$timeout', 'CommonService', 'CuentasService', 'Cuentas', 'TimerService', 'GestionarSubastas', 'Socket', 'Transacciones', 'Messages', 'Alertify'];

  function HomesLive($rootScope, $http, $interval, $scope, $state, HomesService, Authentication, Detalle_subastasService, $timeout, CommonService, CuentasService, Cuentas, TimerService, GestionarSubastas, Socket, Transacciones, Messages, Alertify) {
    var vm = this;
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    var service = CommonService;
    var gestionar = GestionarSubastas;
    vm.authentication = Authentication;
    $rootScope.bodyClass = '';

    vm.setPagination = function(number) {
      vm.currentPage = 0;
      vm.pageSize = number;
    };

    vm.numberOfPages = function(data) {
      if (data === undefined) {
        return;
      }
      return Math.ceil(data.length / vm.pageSize);
    };

    if (Authentication.user) {
      if (vm.authentication.user.roles[0] === 'admin') {
        vm.usertype = 1;
      } else {
        vm.usertype = 0;
      }
    }

    $rootScope.token = '';
    vm.token = function() {
      $rootScope.token = '';
      var possible = 'abcdefghijklmnopqrstuvwxyz0123456789';

      for (var i = 0; i < 12; i++)
        $rootScope.token += possible.charAt(Math.floor(Math.random() * possible.length));
      return $rootScope.token;
    };
    vm.token();

    vm.getServerTime = function() {
      CommonService.getServerTime({
        success: function(response) {
          vm.tiemposervidor = response.data;
        },
        error: function(response) {
          console.log(response);
        }
      });
    };

    vm.getAuthenticated = function() {
      if (!Authentication.user) {
        vm.auth = false;
      } else {
        vm.cuenta = CuentasService.get({ cuentaId: vm.authentication.user._id });
        vm.cuenta.$promise.then(function(data) {
          vm.auth = true;
          vm.userdata = data;
          $rootScope.saldoglobal = data.monto;
          vm.usuario = data.user.displayName;
        });
      }
    };

    startSocket();

    function startSocket() {
      // Si el usuario no ha iniciado sesion redirecciona a
/*      if (!Authentication.user) {
        $state.go('home');
      }*/

      // Si socket no estÃƒÂ¡ conectado, conectamos
      if (!Socket.socket) {
        Socket.connect();
      }

      // 4.- aÃƒÂ±adimos un evento para oir al socket 'updateLiveSocket'
      Socket.on('updateLiveSocket', function (data) {
        vm.updateLive(data);
        vm.processSingleAuctions(data);
        //  vm.live.push(data);
      });

      Socket.on('pushToLive', function (data) {
        //  console.log(data);
        vm.processSingleAuctions(data);
        vm.next.shift();
        vm.live.push(data);
      });

      Socket.on('winner', function(data) {
        vm.updateLive(data);
        //  vm.endAuction(data);
        var msg = "<img src='" + data.producto.imagenUrl + "' height='128' width='256'>" +
        "<h3>Una subasta acaba de terminar: " + data.producto.nombre + "</h3>" +
        "<p>El usuario ganador es: " + data.ultima_oferta.username + "</p>";
        Alertify.log(msg);

      });

      Socket.on('authenticated', function () {
        vm.getAuthenticated();
      });

      // Cuando la instancia del socket es destruida, eliminamos ÃƒÂ©sta
      $scope.$on('$destroy', function () {
        Socket.removeListener('updateLiveSocket');
        Socket.removeListener('pushToLive');
        Socket.removeListener('authenticated');
        Socket.removeListener('winner');
      });
    }

    // 1.- Creamos un metodo para enviar el array
    vm.sendPush = function (data) {
      // Creamos el objeto que pasara por socket
      // Emitimos la data a la configuracion del sevidor
      Socket.emit('updateLiveSocket', data);
      Socket.emit('singleAuction', data);
    };

    vm.updateArray = function() {
      Socket.emit('updateArray');
    };

    vm.getLive = function() {                                 //  INICIO DE LA FUNCIÃƒâ€œN
      GestionarSubastas.getForType(1, {                       //  Llamamos al servicio GetForType para traer las subastas en vivo
        success: function(response) {
        //  console.log(response.data);                       //  Si todo estÃƒÂ¡ bien, traemos una respuesta (el array de datos en vivo)
          vm.processLiveAuctions(response.data);              //  Luego de traer el array, enviamos ÃƒÂ©ste mismo hacia la funciÃƒÂ³n processLiveAuctions, la que se encarga de darle el formato correcto
          vm.live = response.data;                            //  Asignamos el array a una variable local (vm.live), para luego poder usarla en la vista (Ng-repeat)
        },                                                    //  Fin funciÃƒÂ³n success
        error: function(response) {                           //  En caso de error, traer un mensaje de vuelta
          console.log(response);                              //  Pintamos en consola el error
        }                                                     //  Fin funciÃƒÂ³n error
      });                                                     //  Fin llamada de servicio de nuevas Subastas
    };                                                        //  FIN DE LA FUNCIÃƒâ€œN

//  Obtenemos las subastas prÃƒÂ³ximas, despues de esto procesamos su tiempo de espera.
    vm.getNext = function() {
      GestionarSubastas.getForType(2, {
        success: function(response) {
          vm.processNextAuctions(response.data);
          vm.next = response.data;
        },
        error: function(response) {
          console.log(response);
        }
      });
    };

// Obtenemos las subastas terminadas.
    vm.getCompleted = function() {
      GestionarSubastas.getForType(3, {
        success: function(response) {
          vm.completed = response.data;
          console.log(vm.completed);
        },
        error: function(response) {
          console.log(response);
        }
      });
    };

    vm.updateLive = function(data) {
      for (var i in vm.live) {
        if (vm.live[i]._id === data._id) {
          vm.live.splice(i, 1, data);
          break;
        }
      }
    };

    vm.endAuction = function(data) {
      for (var i in vm.live) {
        if (vm.live[i]._id === data._id) {
          vm.live.splice(i, 1);
        }
      }
    };

    //  FunciÃƒÂ³n Procesar subastas individuales
    //  Sirve para procesarlas antes de hacer el push
    vm.processSingleAuctions = function(data) {               //  INICIO DE LA FUNCIÃƒâ€œN, traemos una subasta individual
      var remaining = (data.tiempo_restante - 2000) / 1000;   //  Manipulamos su dato "tiempo_restante" y lo procesamos en segundos en dÃƒÂ©cimales
      $interval(function() {                                  //  Creamos un intervalo de tiempo para que vaya bajando
        data.tiempo_restante = (remaining--) * 1000;          //  Asignamos al dato tiempo_restante del array, un nuevo tiempo de vida hacia atrÃƒÂ¡s
        console.log('single: ' + data.tiempo_restante);
        //  $scope.$apply;                                        //  Aplicamos un $scope para que pueda actualizarse en la vista
      }, 1000, 0);                                            //  Asignamos el intervalo de tiempo en el cual se modificarÃƒÂ¡ el tiempo (1 segundo)
    };                                                        //  FIN DE LA FUNCIÃƒâ€œN

    vm.processLiveAuctions = function (data) {                //  INICIO DE LA FUNCIÃƒâ€œN, traemos el array de subastas en vivo
      angular.forEach(data, function (item) {                 //  Recorremos cada valor de ÃƒÂ©ste array
        var remaining = (item.tiempo_restante - 1000) / 1000; //  Para cada valor, procesamos el tiempo restante-
        vm.liveInterval = $interval(function() {                                //  Generamos un intervalo de tiempo para que el tiempo_restante llegue a cero en algÃƒÂºn momento
          item.remainingLiveTime = (remaining--) * 1000;      //  Asignamos a item.remainingLivetime el valor cambiante, para luego mostrarse en la vista como un timer
          if (item.remainintLiveTime < 0) {
            vm.destroy();
          }
          //  $scope.$apply;                                      //  Aplicamos el $scope para que se actualice todo en la vista
        }, 1000, 0);                                          //  Asignamos 1 segundo para el intervalo.
        vm.destroy = function() {
          $interval.cancel(vm.liveInterval);
        };
      });                                                     //  Fin intervalo
    };                                                        //  FIN DE LA FUNCIÃƒâ€œN

    vm.processNextAuctions = function (data) {
      var tiemporestante;
      angular.forEach(data, function (item) {
        var remaining = (item.tiempo_restante - 1000) / 1000;
        vm.intervalo = $interval(function() {
          tiemporestante = (remaining--) * 1000;
          if (tiemporestante > 86400000) {
            item.remainingNextTime = tiemporestante;
            //  $scope.$apply;
          } else {
            vm.destroy();
          }
        }, 1000, 0);

        vm.destroy = function() {
          $interval.cancel(vm.intervalo);
        };

      });
    };

    vm.updateBalance = function(userid) {
      Cuentas.updateBalance(userid, {
        success: function(response) {
          $rootScope.saldoglobal = response.data.monto;
        },
        error: function(response) {
        }
      });
    };

    vm.createTransaction = function(auctionid, userid, token, titulo) {
      vm.transaction = {
        'subasta': auctionid + token,
        'estado': 0,
        'saldo': $rootScope.saldoglobal,
        'user': userid
      };
      Transacciones.createTransaction(vm.transaction, {
        success: function(response) {
          vm.updateArray();
          vm.createTransactionBalance(auctionid, userid, titulo);
        },
        error: function(response) {
          console.log(response);
        }
      });
    };

    vm.createTransactionBalance = function(auctionid, userid, titulo) {
      vm.transaction = {
        'tipo_recarga': 'Puja de Subasta',
        'soles_transferencia': 1,
        'transaccion_tipo': 'Debito',
        'estado': 1,
        'tipo': 1,
        'descripcion': titulo,
        'user': userid,
        'subasta': auctionid
      };
      Transacciones.createTransactionBalance(vm.transaction, {
        success: function(response) {
          console.log(response.data);
        },
        error: function(response) {
          console.log(response);
        }
      });
    };

    vm.auctionProcessing = function(auctionid, userid, titulo) {
      var newid = "";
      var token = $rootScope.token;
      var right = userid.substring(0, 12);
      var left = userid.substring(12, 24);
      newid = right + token + left;
      var data = {
        'userid': newid
      };
      TimerService.updateTimer(auctionid, data, {
        success: function(response) {
          vm.updateBalance(userid);
          vm.createTransaction(auctionid, userid, token, titulo);
          vm.sendPush(response.data);
          vm.token();
        },
        error: function(response) {
          console.log(response);
          Alertify.error(response.data.message);
        }
      });
    };

    vm.pushAuction = function(auctiondata, userdata) {
      vm.auctionProcessing(auctiondata._id, userdata._id, auctiondata.titulo);
    };


    vm.getServerTime();
    vm.getLive();
    vm.getNext();
    vm.getCompleted();
    vm.getAuthenticated();

  }
}());
