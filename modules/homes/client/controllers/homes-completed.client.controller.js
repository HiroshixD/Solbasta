(function () {
  'use strict';


  var app = angular
    .module('homes')
    .controller('HomesCompletedController', HomesCompletedController);

  HomesCompletedController.$inject = ['$rootScope', '$http', '$interval', '$scope', '$state', 'HomesService', 'Authentication', 'Detalle_subastasService', '$timeout', 'CommonService', 'CuentasService', 'Cuentas', 'TimerService', 'GestionarSubastas', 'Socket', 'Transacciones', 'Messages', 'Alertify', 'ReminderCrud', 'SliderService', 'UserSettingsService'];

  function HomesCompletedController($rootScope, $http, $interval, $scope, $state, HomesService, Authentication, Detalle_subastasService, $timeout, CommonService, CuentasService, Cuentas, TimerService, GestionarSubastas, Socket, Transacciones, Messages, Alertify, ReminderCrud, SliderService, UserSettingsService) {
    var vm = this;
    var service = CommonService;
    var gestionar = GestionarSubastas;
    vm.authentication = Authentication;
    vm.createReminderVisible = true;
    $rootScope.bodyClass = 'home';
    var userSession = JSON.parse(localStorage.getItem('userSession'));

    // Cambiar clase para el html - terminadas
    vm.changeClass = function(seccion) {
      if (seccion === 'terminadas' || seccion === 'proximas' || seccion === 'como-juego') {
        $rootScope.bodyClass = '';
      }
    };

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

    vm.signout = function() {
      localStorage.removeItem('userSession');
      document.location.href = '/api/auth/signout';
    };

    if (Authentication.user) {
      if (vm.authentication.user.roles[0] === 'admin') {
        vm.usertype = 1;
      } else {
        vm.usertype = 0;
      }
    }

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
      if (userSession === null) {
        vm.auth = false;
      } else {
        vm.cuenta = CuentasService.get({ cuentaId: userSession._id });
        vm.cuenta.$promise.then(function(data) {
          vm.auth = true;
          vm.userdata = data;
          $rootScope.saldoglobal = data.monto;
          vm.usuario = data.user.displayName;
        });
      }
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

    /*
    Lógica para subastas terminadas
    */
    vm.getThreeMonths = function() {
      GestionarSubastas.getThreeMonths({
        success: function(response) {
          vm.completed = response.data;
        },
        error: function(response) {
          alert('error');
        }
      });
    };

    vm.getSixMonths = function() {
      GestionarSubastas.getSixMonths({
        success: function(response) {
          vm.completed = response.data;
        },
        error: function(response) {
          alert('error');
        }
      });
    };

    vm.customizedSearch = function(key) {
      if (key.length >= 2) {
        vm.getAuctionsForText(key);
      }
    };

    vm.getAuctionsForText = function(key) {
      GestionarSubastas.getAuctionsForText(key, {
        success: function(response) {
          vm.completed = response.data;
        },
        error: function(response) {
          console.log(response);
        }
      });
    };

    vm.getServerTime();
    vm.getCompleted();
    vm.getAuthenticated();
/*

    $http.get('/api/auctions/process/2').success(function(data) {
      vm.next2 = data;
      console.log(vm.next);
    });*/

  }
}());
