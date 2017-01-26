(function () {
  'use strict';

  angular
    .module('contactos')
    .controller('ContactosController', ContactosController);

  ContactosController.$inject = ['$scope', '$state', 'contactoResolve', '$window', 'Authentication'];

  function ContactosController($scope, $state, contacto, $window, Authentication) {
    var vm = this;

    vm.contacto = contacto;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Contacto
    function remove() {
      if ($window.confirm('Estás segur@ de eliminarlo??')) {
        vm.contacto.$remove($state.go('contactos.list'));
      }
    }

    // Save Contacto
    function save(isValid) {
    // Si no es válido mostrar el error
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.contactoForm');
        return false;
      }

      // Si el formulario es válido llama al servicio vm.contacto
      vm.contacto.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('contactos.view', {
          contactoId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
