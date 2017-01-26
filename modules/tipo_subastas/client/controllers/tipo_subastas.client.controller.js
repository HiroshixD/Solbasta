(function () {
  'use strict';

  angular
    .module('tipo_subastas')
    .controller('Tipo_subastasController', Tipo_subastasController);

  Tipo_subastasController.$inject = ['$scope', '$state', 'tipo_subastaResolve', '$window', 'Authentication'];

  function Tipo_subastasController($scope, $state, tipo_subasta, $window, Authentication) {
    var vm = this;

    vm.tipo_subasta = tipo_subasta;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Tipo_subasta
    function remove() {
      if ($window.confirm('Estás segur@ de eliminarlo??')) {
        vm.tipo_subasta.$remove($state.go('tipo_subastas.list'));
      }
    }

    // Save Tipo_subasta
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.tipo_subastaForm');
        return false;
      }

      // Create a new tipo_subasta, or update the current instance
      vm.tipo_subasta.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('tipo_subastas.view', {
          tipo_subastaId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
