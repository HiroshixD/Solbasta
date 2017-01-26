(function () {
  'use strict';

  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$rootScope', '$http', '$scope', '$state', 'Authentication', 'menuService', 'CuentasService', 'SliderService'];
  // Añadido CuentasService --> //  Hiro Code Review
  function HeaderController($rootScope, $http, $scope, $state, Authentication, menuService, CuentasService, SliderService) {
    var vm = this;
    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.authentication = Authentication;
    vm.isCollapsed = false;
    vm.menu = menuService.getMenu('topbar');
    $rootScope.bodyClass = 'home';
    var userSession = JSON.parse(localStorage.getItem('userSession'));
    vm.hola = 'hola';
    vm.getSliders = function() {
      SliderService.getSliders({
        success: function(response) {
          vm.slider = response.data.length;
        },
        error: function(response) {
          console.log(response);
        }
      });
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

    $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    function stateChangeSuccess() {
      // Collapsing the menu after navigation
      vm.isCollapsed = false;
    }

    vm.getSliders();
    vm.getAuthenticated();

  }
}());
