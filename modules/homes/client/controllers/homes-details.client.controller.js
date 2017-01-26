(function () {
  'use strict';

  angular
    .module('detalle_subastas')
    .controller('Home_DetailsController', Home_DetailsController);

  Home_DetailsController.$inject = ['$rootScope', '$interval', '$http', '$scope', '$state', 'detalle_subastaResolve', '$window', 'Authentication', 'ProductosService', 'Tipo_subastasService', 'CommonService', 'Socket', 'TimerService', 'CuentasService', 'Cuentas', 'Transacciones', 'Messages', 'GestionarSubastas', 'Alertify'];

  function Home_DetailsController($rootScope, $interval, $http, $scope, $state, detalle_subasta, $window, Authentication, ProductosService, Tipo_subastasService, CommonService, Socket, TimerService, CuentasService, Cuentas, Transacciones, Messages, GestionarSubastas, Alertify) {
    var vm = this;
    $rootScope.bodyClass = "subasta";
    vm.detalle_subasta = detalle_subasta;
    console.log(vm.detalle_subasta);
    vm.authentication = Authentication;
    vm.productos = ProductosService.query();
    vm.tipo_subastas = Tipo_subastasService.query();
    vm.userSession = JSON.parse(localStorage.getItem("userSession"));
    document.body.scrollTop = document.documentElement.scrollTop = 0;

    $rootScope.token = "";
    vm.token = function() {
      $rootScope.token = "";
      var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < 12; i++)
        $rootScope.token += possible.charAt(Math.floor(Math.random() * possible.length));
      return $rootScope.token;
    };
    vm.token();

    vm.getServerTime = function() {
      CommonService.getServerTime({
        success: function(response) {
          vm.servertime = response.data;
        },
        error: function(response) {
          console.log(response);
        }
      });
    };

    vm.getAuthenticated = function() {                                                 // FUNCIONALIDAD: Verificar si el usuario estÃ¡ autenticado
      if (vm.userSession === null) {                                                      // SI el usuario no estÃ¡ autenticado / Logeado
        vm.auth = false;                                                               // Asignamos el valor false a vm.auth, Ã©ste harÃ¡ que no se muestre la data
      } else {                                                                         // Si estÃ¡ autenticado
        vm.cuenta = CuentasService.get({ cuentaId: vm.userSession._id });      // creamos la variable / scope cuenta y le asignamos el valor de la querie
        vm.cuenta.$promise.then(function(data) {                                       // Capturamos el valor retornado ($promise) y convertimos su valor a datos que puedan ser accedidos
          vm.auth = true;                                                              // Asignamos valor true a vm.auth
          vm.userdata = data;                                                        // Asignamos una variable "userdata" y obtenemos estos datos
          $rootScope.saldoglobal = data.monto;                                                       // Obtenemos la variable data.monto(saldo) para no estÃ¡r accediendolo desde userdata
          vm.usuario = data.user.displayName;                                          // Buscamos el nombre del usuario (no nickname)
        });                                                                            //
      }                                                                                //
    };                                                                                 // FIN DE LA FUNCION

    if (vm.userSession !== null && vm.detalle_subasta.estado === 1) {
      vm.auctionClass = 'oferta';
    } else if (vm.userSession !== null && vm.detalle_subasta.estado === 1) {
      vm.auctionClass = '';
    } else if (vm.detalle_subasta.estado === 3) {
      vm.auctionClass = 'vendido';
    }

    vm.getLive = function() {                                 //  INICIO DE LA FUNCIÃƒâ€œN
      GestionarSubastas.getFiveForType(1, {                       //  Llamamos al servicio GetForType para traer las subastas en vivo
        success: function(response) {
          console.log('subastas en vivo');
          console.log(response.data);                       //  Si todo estÃƒÂ¡ bien, traemos una respuesta (el array de datos en vivo)
          vm.live = response.data;                            //  Asignamos el array a una variable local (vm.live), para luego poder usarla en la vista (Ng-repeat)
        },                                                    //  Fin funciÃƒÂ³n success
        error: function(response) {                           //  En caso de error, traer un mensaje de vuelta
          console.log(response);                              //  Pintamos en consola el error
        }                                                     //  Fin funciÃƒÂ³n error
      });                                                     //  Fin llamada de servicio de nuevas Subastas
    };

    vm.getAllTransactions = function() {                                               // FUNCIONALIDAD: Obtener todas las transacciones por el id de la subasta
      Transacciones.getTransactionsForAuction(vm.detalle_subasta._id, {                // Llamamos al metodo para obtener las transacciones, le damos el id de la subasta
        success: function(response) {                                                  // Si todo salio bien
          vm.offers = response.data;
          vm.ofertas = [];
          vm.monto = (vm.offers.length + 1) * 0.01;
          if (vm.offers.length > 0) {
            for (var i = 0; i < vm.offers.length; i++) {
              vm.monto = (vm.monto - 0.01).toFixed(2);
              vm.ofertas.push({ usuario: vm.offers[i].user.username, monto: vm.monto });
            }
          }
        },                                                                             //
        error: function(response) {
          Alertify.error('error inesperado');                                          // Funciones de error
        }                                                                              //
      });                                                                              //
    };                                                                                 // FIN DE LA FUNCIÃ“N

    vm.startSocket = function() {

      // Si socket no estÃ¡ conectado, conectamos
      if (!Socket.socket) {
        Socket.connect();
      }

      // 4.- aÃ±adimos un evento para oir al socket 'singleAuction'
      Socket.on('singleAuction', function (data) {
        vm.detalle_subasta = data;
        vm.processTime(vm.detalle_subasta);
      });

      Socket.on('updateArray', function() {
        vm.getAllTransactions();
      });

      Socket.on('winner', function(data) {
        vm.updateData(data);
        vm.auctionClass = 'vendido';
        //  vm.endAuction(data);
        var msg = "<img src='" + data.producto.imagenUrl + "' height='128' width='256'>" +
        "<h3>Una subasta acaba de terminar: " + data.producto.nombre + "</h3>" +
        "<p>El usuario ganador es: " + data.ultima_oferta.username + "</p>";
        Alertify.log(msg);
      });

      // Cuando la instancia del socket es destruida, eliminamos Ã©sta
      $scope.$on('$destroy', function () {
        Socket.removeListener('singleAuction');
      });
    };

    // 1.- Creamos un metodo para enviar el array
    vm.sendPush = function (data) {
      // Creamos el objeto que pasara por socket
      // Emitimos la data a la configuracion del sevidor
      Socket.emit('singleAuction', data);
      Socket.emit('updateLiveSocket', data);
      Socket.emit('authenticated');
    };

    vm.updateArray = function() {
      Socket.emit('updateArray');
    };

    vm.processTime = function(data) {
      console.log(data.tiempo_restante);
      if (vm.intervalo) {
        $interval.cancel(vm.intervalo);
      }
      var remaining = (data.tiempo_restante - 1000) / 1000;
      vm.intervalo = $interval(function() {
        vm.timeRemaining = (remaining--) * 1000;
        //  $scope.$apply;
      }, 1000, 0);
    };

    vm.updateData = function(data) {
      vm.detalle_subasta = data;
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

    vm.createTransactionBalance = function(auctionid, userid, descripcion) {
      vm.transaction = {
        'tipo_recarga': 'Puja de Subasta',
        'soles_transferencia': 1,
        'transaccion_tipo': 'Débito',
        'estado': 1,
        'tipo': 1,
        'descripcion': descripcion,
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

    vm.pushAuction = function(auctiondata, userdata) {
      vm.auctionProcessing(auctiondata._id, userdata._id, auctiondata.titulo);
    };

    vm.auctionProcessing = function(auctionid, userid, statement, titulo) {
      var token = $rootScope.token;
      var right = userid.substring(0, 12);
      var left = userid.substring(12, 24);
      var newid = right + token + left;
      var data = {
        'userid': newid
      };
      TimerService.updateTimer(auctionid, data, {
        success: function(response) {
          vm.detalle_subasta.ultima_oferta = userid;
          vm.updateBalance(userid);
          vm.createTransaction(auctionid, userid, token, titulo);
          vm.sendPush(response.data);
          vm.token();
        },
        error: function(response) {
          Alertify.error(response.data.message);
        }
      });
    };

    vm.getServerTime();
    vm.startSocket();
    vm.getAllTransactions();
    vm.processTime(vm.detalle_subasta);
    vm.getAuthenticated();
    vm.getLive();


  }
}());
