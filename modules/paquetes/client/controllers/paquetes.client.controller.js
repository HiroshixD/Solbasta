(function () {
  'use strict';

  angular
    .module('paquetes')
    .controller('PaquetesController', PaquetesController);

  PaquetesController.$inject = ['$scope', '$state', 'paqueteResolve', '$window', 'Authentication'];

  function PaquetesController($scope, $state, paquete, $window, Authentication) {
    var vm = this;

    vm.paquete = paquete;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Paquete
    function remove() {
      if ($window.confirm('Estás segur@ de eliminarlo??')) {
        vm.paquete.$remove($state.go('paquetes.list'));
      }
    }

    // Save Paquete
    function save(isValid) {
    // Si no es válido mostrar el error
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.paqueteForm');
        return false;
      }

      // Si el formulario es válido llama al servicio vm.paquete
      vm.paquete.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('paquetes.view', {
          paqueteId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
