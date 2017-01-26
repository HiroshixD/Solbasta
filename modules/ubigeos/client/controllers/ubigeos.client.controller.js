(function () {
  'use strict';

  angular
    .module('ubigeos')
    .controller('UbigeosController', UbigeosController);

  UbigeosController.$inject = ['$scope', '$state', 'ubigeoResolve', '$window', 'Authentication'];

  function UbigeosController($scope, $state, ubigeo, $window, Authentication) {
    var vm = this;

    vm.ubigeo = ubigeo;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Ubigeo
    function remove() {
      if ($window.confirm('Estás segur@ de eliminarlo??')) {
        vm.ubigeo.$remove($state.go('ubigeos.list'));
      }
    }

    // Save Ubigeo
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.ubigeoForm');
        return false;
      }

      // Create a new ubigeo, or update the current instance
      vm.ubigeo.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('ubigeos.view', {
          ubigeoId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
