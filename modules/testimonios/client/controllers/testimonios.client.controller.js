(function () {
  'use strict';

  angular
    .module('testimonios')
    .controller('TestimoniosController', TestimoniosController);

  TestimoniosController.$inject = ['$scope', '$state', 'testimonioResolve', '$window', 'Authentication'];

  function TestimoniosController($scope, $state, testimonio, $window, Authentication) {
    var vm = this;

    vm.testimonio = testimonio;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Testimonio
    function remove() {
      if ($window.confirm('Estás segur@ de eliminarlo??')) {
        vm.testimonio.$remove($state.go('testimonios.list'));
      }
    }

    // Save Testimonio
    function save(isValid) {
    // Si no es válido mostrar el error
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.testimonioForm');
        return false;
      }

      // Si el formulario es válido llama al servicio vm.testimonio
      vm.testimonio.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('testimonios.view', {
          testimonioId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
