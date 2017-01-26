(function () {
  'use strict';

  angular
    .module('eventos')
    .controller('EventosController', EventosController);

  EventosController.$inject = ['$scope', '$state', 'eventoResolve', '$window', 'Authentication'];

  function EventosController($scope, $state, evento, $window, Authentication) {
    var vm = this;

    vm.evento = evento;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Evento
    function remove() {
      if ($window.confirm('Estás segur@ de eliminarlo??')) {
        vm.evento.$remove($state.go('eventos.list'));
      }
    }

    // Save Evento
    function save(isValid) {
    // Si no es válido mostrar el error
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.eventoForm');
        return false;
      }

      // Si el formulario es válido llama al servicio vm.evento
      vm.evento.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('eventos.view', {
          eventoId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
