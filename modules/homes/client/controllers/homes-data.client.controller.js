(function () {
  'use strict';

  angular
    .module('homes')
    .controller('HomeDataController', HomeDataController);

  HomeDataController.$inject = ['$rootScope', '$scope', '$state', '$window', 'Authentication', '$timeout', 'Transacciones', 'UbigeosCascadeService', 'Datos_enviosService', 'DireccionesService', 'Alertify'];

  function HomeDataController($rootScope, $scope, $state, $window, Authentication, $timeout, Transacciones, UbigeosCascadeService, Datos_enviosService, DireccionesService, Alertify) {
    var vm = this;
    vm.authentication = Authentication;
    vm.userSession = JSON.parse(localStorage.getItem('userSession'));
    vm.userid = vm.userSession._id;
    vm.direccion = {};

    vm.datos_envios = Datos_enviosService.get({ datos_envioId: vm.userid });
    vm.datos_envios.$promise.then(function(data) {
      vm.direccion = data;
    });

    //  DireccionesService.modifyAddress();
    vm.saveChanges = function() {
      DireccionesService.modifyAddress(vm.userid, vm.direccion, {
        success: function(response) {
          Alertify.success('TU INFORMACIÓN HA SIDO CAMBIADA SATISFACTORIAMENTE');
        },
        error: function(response) {
          console.log(response);
        }
      });
    };

    vm.getDepartamentos = function() {
      UbigeosCascadeService.getDepartamentos({
        success: function(response) {
          vm.departamentos = response.data;
          console.log(vm.departamentos);
        },
        error: function(response) {
          console.log(response);
        }
      });
    };

    vm.getProvincias = function(departamento) {
      UbigeosCascadeService.getProvincias(departamento, {
        success: function(response) {
          vm.provincias = response.data;
        },
        error: function(response) {
          console.log(response);
        }
      });
    };

    vm.getDistritos = function(provincia) {
      UbigeosCascadeService.getDistritos(provincia, {
        success: function(response) {
          vm.distritos = response.data;
        },
        error: function(response) {
          console.log(response);
        }
      });
    };

    vm.getDepartamentos();
  }
}());
