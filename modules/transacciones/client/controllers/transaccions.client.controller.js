(function () {
  'use strict';

  angular
    .module('transaccions')
    .controller('TransaccionsController', TransaccionsController);

  TransaccionsController.$inject = ['$scope', '$state', 'transaccionResolve', '$window', 'Authentication'];

  function TransaccionsController($scope, $state, transaccion, $window, Authentication) {
    var vm = this;

    vm.transaccion = transaccion;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Transaccion
    function remove() {
      if ($window.confirm('Estás segur@ de eliminarlo??')) {
        vm.transaccion.$remove($state.go('transaccions.list'));
      }
    }

    // Save Transaccion
    function save(isValid) {
    // Si no es válido mostrar el error
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.transaccionForm');
        return false;
      }

      // Si el formulario es válido llama al servicio vm.transaccion
      vm.transaccion.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('transaccions.view', {
          transaccionId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
