(function () {
  'use strict';

  angular
    .module('homes')
    .controller('HomesController', HomesController);

  HomesController.$inject = ['$scope', '$state', 'homeResolve', '$window', 'Authentication'];

  function HomesController($scope, $state, home, $window, Authentication) {
    var vm = this;

    vm.home = home;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Home
    function remove() {
      if ($window.confirm('Estás segur@ de eliminarlo??')) {
        vm.home.$remove($state.go('homes.list'));
      }
    }

    // Save Home
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.homeForm');
        return false;
      }

      // Create a new home, or update the current instance
      vm.home.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('homes.view', {
          homeId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
