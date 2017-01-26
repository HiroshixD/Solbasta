(function () {
  'use strict';


  var app = angular
    .module('homes')
    .controller('HomesNextAndRemindersController', HomesNextAndRemindersController);

  HomesNextAndRemindersController.$inject = ['$rootScope', '$http', '$interval', '$scope', '$state', 'HomesService', 'Authentication', 'Detalle_subastasService', '$timeout', 'CommonService', 'CuentasService', 'Cuentas', 'TimerService', 'GestionarSubastas', 'Socket', 'Transacciones', 'Messages', 'Alertify', 'ReminderCrud', 'SliderService', 'UserSettingsService'];

  function HomesNextAndRemindersController($rootScope, $http, $interval, $scope, $state, HomesService, Authentication, Detalle_subastasService, $timeout, CommonService, CuentasService, Cuentas, TimerService, GestionarSubastas, Socket, Transacciones, Messages, Alertify, ReminderCrud, SliderService, UserSettingsService) {
    var vm = this;
    var service = CommonService;
    var gestionar = GestionarSubastas;
    vm.authentication = Authentication;
    vm.createReminderVisible = true;
    $rootScope.bodyClass = "home";
    var userSession = JSON.parse(localStorage.getItem("userSession"));

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

    // Cambiar clase para el html - terminadas
    vm.changeClass = function(seccion) {
      if (seccion === 'terminadas' || seccion === 'proximas' || seccion === 'como-juego') {
        $rootScope.bodyClass = "";
      }
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

    vm.getNextForReminder = function() {
      GestionarSubastas.getNext({
        success: function(response) {
          vm.reminderData = response.data;
          console.log('AQUI REMINDERDATA');
          console.log(vm.reminderData);
          for (var i = 0; i < vm.reminderData.length; i++) {
            vm.reminderData[i].fecha_inicio = moment(vm.reminderData[i].fecha_inicio).add(5, 'hours').toISOString();
          }
        },
        error: function(response) {
          console.log(response);
        }
      });
    };

    vm.createReminder = function(id) {
      vm.arrayReminder = {
        'subasta': id
      };
      ReminderCrud.createReminder(vm.arrayReminder, {
        success: function(response) {
          for (var i in vm.reminderData) {
            if (vm.reminderData[i]._id === id) {
              vm.reminderData[i].remindered = true;
              break;
            }
          }
        },
        error: function(response) {
          alert('error inesperado');
        }
      });
    };

    vm.deleteReminder = function(idsubasta) {
      vm.idusuario = userSession._id;
      vm.idsubasta = idsubasta;
      ReminderCrud.deleteReminder(vm.idsubasta, vm.idusuario, {
        success: function(response) {
          for (var i in vm.reminderData) {
            if (vm.reminderData[i]._id === vm.idsubasta) {
              vm.reminderData[i].remindered = false;
              break;
            }
          }
        },
        error: function(response) {
          console.log(response);
        }
      });
    };

    vm.getReminderById = function(idsubasta) {
      if (userSession._id === undefined) {
        return;
      }
      vm.idusuario = userSession._id;
      // Busca si hay recordatorio para la oferta
      ReminderCrud.getReminderByAuction(idsubasta, vm.idusuario, {
        success: function(response) {
          if (response.data.length > 0) {
            for (var i = 0; i < vm.reminderData.length; i++) {
              if (vm.reminderData[i]._id === idsubasta) {
                vm.reminderData[i].remindered = true;
              }
            }
          }
        },
        error: function(response) {
          console.log(response);
        }
      });
    };

    vm.getServerTime();
    vm.getNextForReminder();
    vm.getAuthenticated();
/*

    $http.get('/api/auctions/process/2').success(function(data) {
      vm.next2 = data;
      console.log(vm.next);
    });*/

  }
}());
