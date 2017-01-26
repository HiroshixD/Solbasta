(function () {
  'use strict';

  angular
    .module('transaccion_saldos')
    .controller('Transaccion_saldosController', Transaccion_saldosController);

  Transaccion_saldosController.$inject = ['$scope', '$state', 'transaccion_saldoResolve', '$window', 'Authentication'];

  function Transaccion_saldosController($scope, $state, transaccion_saldo, $window, Authentication) {
    var vm = this;

    vm.transaccion_saldo = transaccion_saldo;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Transaccion_saldo
    function remove() {
      if ($window.confirm('Estás segur@ de eliminarlo??')) {
        vm.transaccion_saldo.$remove($state.go('transaccion_saldos.list'));
      }
    }

    // Save Transaccion_saldo
    function save(isValid) {
    // Si no es válido mostrar el error
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.transaccion_saldoForm');
        return false;
      }

      // Si el formulario es válido llama al servicio vm.transaccion_saldo
      vm.transaccion_saldo.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('transaccion_saldos.view', {
          transaccion_saldoId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
