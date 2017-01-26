(function () {
  'use strict';

  var app = angular
    .module('homes')
    .controller('HomeAccountController', HomeAccountController);

  HomeAccountController.$inject = ['$http', '$rootScope', '$scope', '$state', '$window', 'Authentication', '$timeout', 'Transacciones', 'UserSettingsService', 'Alertify'];

  function HomeAccountController($http, $rootScope, $scope, $state, $window, Authentication, $timeout, Transacciones, UserSettingsService, Alertify) {
    var vm = this;
    vm.password = {};
    vm.userSession = JSON.parse(localStorage.getItem('userSession'));
    vm.authentication = Authentication;
    console.log(vm.authentication.user);

    // Trabajando variables de filtros
    vm.setPagination = function(number) {
      vm.currentPage = 0;
      vm.pageSize = number;
    };

    vm.numberOfPages = function(transactions) {
      if (transactions === undefined) {
        return;
      }
      return Math.ceil(transactions.length / vm.pageSize);
    };

    vm.manageSuscription = function() {
      UserSettingsService.manageSuscriptions({
        success: function(response) {
          vm.authentication.user.suscriptionState = response.data;
        },
        error: function(response) {
          alert('error');
        }
      });
    };

    Transacciones.getAllBalanceTransactions(vm.userSession._id, {
      success: function(response) {
        vm.transactions = response.data;
        vm.numberOfPages(response.data);
      },
      error: function(response) {
        console.log(response);
      }
    });

    vm.updateUser = function() {
      var passwordlength = Object.keys(vm.password).length;
      if (passwordlength === 3) {
        vm.updatePassword();
        return;
      } else if (passwordlength > 0) {
        Alertify.error('POR FAVOR VERIFICA LOS DATOS DEL FORMULARIO DE CONTRASEÑA');
        vm.password = [];
        return;
      }
      vm.updateInfo();
      return;

    };

    vm.updateInfo = function() {
      UserSettingsService.modifyUser(vm.authentication.user, {
        success: function(response) {
          vm.user = response.data;
          Alertify.success('TUS DATOS PERSONALES SE MODIFICARON EXITÓSAMENTE');
        },
        error: function(response) {
          console.log(response.message);
        }
      });
    };

    vm.updatePassword = function() {
      console.log('data que va');
      console.log(vm.password);
      $http.post('/api/users/password', vm.password).success(function (response) {
        // If successful show success message and clear form
        $scope.$broadcast('show-errors-reset', 'vm.passwordForm');
        vm.success = true;
        vm.passwordDetails = null;
        Alertify.success("TU CONTRASEÑA HA CAMBIADO SATISFACTORIAMENTE");
      }).error(function (response) {
        vm.error = response.message;
        Alertify.error(vm.error);
      });
    };

    vm.getFilter = function(item) {
      vm.filter = [];
      if (parseInt(item, 10) === 0 || parseInt(item, 10) === 1 || parseInt(item, 10) === 2) {
        vm.filter.tipo = parseInt(item, 10);
        return;
      }
      vm.orderby = item;
    };
  }
}());
