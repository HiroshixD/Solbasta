(function () {
  'use strict';

  angular
    .module('marcas')
    .controller('MarcasController', MarcasController);

  MarcasController.$inject = ['$scope', '$state', 'marcaResolve', '$window', 'Authentication'];

  function MarcasController($scope, $state, marca, $window, Authentication) {
    var vm = this;

    vm.marca = marca;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Marca
    function remove() {
      if ($window.confirm('Estás segur@ de eliminarlo??')) {
        vm.marca.$remove($state.go('marcas.list'));
      }
    }

    // Save Marca
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.marcaForm');
        return false;
      }

      // Create a new marca, or update the current instance
      vm.marca.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('marcas.view', {
          marcaId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
