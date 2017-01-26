(function () {
  'use strict';

  angular
    .module('transaccion_cuentas')
    .controller('Transaccion_cuentasController', Transaccion_cuentasController);

  Transaccion_cuentasController.$inject = ['$scope', '$state', 'transaccion_cuentaResolve', '$window', 'Authentication'];

  function Transaccion_cuentasController($scope, $state, transaccion_cuenta, $window, Authentication) {
    var vm = this;

    vm.transaccion_cuenta = transaccion_cuenta;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Transaccion_cuenta
    function remove() {
      if ($window.confirm('Estás segur@ de eliminarlo??')) {
        vm.transaccion_cuenta.$remove($state.go('transaccion_cuentas.list'));
      }
    }

    // Save Transaccion_cuenta
    function save(isValid) {
    // Si no es válido mostrar el error
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.transaccion_cuentaForm');
        return false;
      }

      // Si el formulario es válido llama al servicio vm.transaccion_cuenta
      vm.transaccion_cuenta.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('transaccion_cuentas.view', {
          transaccion_cuentaId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
