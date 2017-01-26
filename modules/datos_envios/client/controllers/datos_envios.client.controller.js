(function () {
  'use strict';

  angular
    .module('datos_envios')
    .controller('Datos_enviosController', Datos_enviosController);

  Datos_enviosController.$inject = ['$scope', '$state', 'datos_envioResolve', '$window', 'Authentication'];

  function Datos_enviosController($scope, $state, datos_envio, $window, Authentication) {
    var vm = this;

    vm.datos_envio = datos_envio;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Datos_envio
    function remove() {
      if ($window.confirm('Estás segur@ de eliminarlo??')) {
        vm.datos_envio.$remove($state.go('datos_envios.list'));
      }
    }

    // Save Datos_envio
    function save(isValid) {
    // Si no es válido mostrar el error
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.datos_envioForm');
        return false;
      }

      // Si el formulario es válido llama al servicio vm.datos_envio
      vm.datos_envio.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('datos_envios.view', {
          datos_envioId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
