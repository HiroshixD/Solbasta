(function () {
  'use strict';

  angular
    .module('compartidos')
    .controller('CompartidosController', CompartidosController);

  CompartidosController.$inject = ['$scope', '$state', 'compartidoResolve', '$window', 'Authentication'];

  function CompartidosController($scope, $state, compartido, $window, Authentication) {
    var vm = this;

    vm.compartido = compartido;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Compartido
    function remove() {
      if ($window.confirm('Estás segur@ de eliminarlo??')) {
        vm.compartido.$remove($state.go('compartidos.list'));
      }
    }

    // Save Compartido
    function save(isValid) {
    // Si no es válido mostrar el error
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.compartidoForm');
        return false;
      }

      // Si el formulario es válido llama al servicio vm.compartido
      vm.compartido.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('compartidos.view', {
          compartidoId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
