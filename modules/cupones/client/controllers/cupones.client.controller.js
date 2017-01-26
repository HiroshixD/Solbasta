(function () {
  'use strict';

  angular
    .module('cupones')
    .controller('CuponesController', CuponesController);

  CuponesController.$inject = ['$scope', '$state', 'cuponResolve', '$window', 'Authentication'];

  function CuponesController($scope, $state, cupon, $window, Authentication) {
    var vm = this;

    vm.cupon = cupon;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.generarCupon = generarCupon;

    function generarCupon() {
      var s = '';
      var randomchar = function() {
        var n = Math.floor(Math.random() * 62);
        if (n < 10) return n; //  1-10
        if (n < 36) return String.fromCharCode(n + 55); //  A-Z
        return String.fromCharCode(n + 61); // a-z
      };
      while (s.length < 8) s += randomchar();
      vm.cupon.codigo = s.toUpperCase();
    }

    // Remove existing Cupone
    function remove() {
      if ($window.confirm('Estás segur@ de eliminarlo??')) {
        vm.cupon.$remove($state.go('cupones.list'));
      }
    }

    // Save Cupone
    function save(isValid) {
    // Si no es válido mostrar el error
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.cuponForm');
        return false;
      }

      // Si el formulario es válido llama al servicio vm.cupon
      vm.cupon.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('cupones.view', {
          cuponId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
