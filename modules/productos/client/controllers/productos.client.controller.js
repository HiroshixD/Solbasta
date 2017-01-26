(function () {
  'use strict';

  angular
    .module('productos')
    .controller('ProductosController', ProductosController);

  ProductosController.$inject = ['$scope', '$state', 'productoResolve', '$window', 'Authentication', 'CategoriasService', 'MarcasService', 'Alertify'];

  function ProductosController($scope, $state, producto, $window, Authentication, CategoriasService, MarcasService, Alertify) {
    var vm = this;
    vm.producto = producto;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.categorias = CategoriasService.query();
    vm.marcas = MarcasService.query();

    // Remove existing Producto
    function remove() {
      if ($window.confirm('Estás segur@ de eliminarlo??')) {
        vm.producto.$remove($state.go('productos.list'));
      }
    }

    // Save Producto
    function save(isValid) {
      if (!vm.producto.categoria) {
        Alertify.error('Ingresa la categoría');
        return;
      }
      if (!vm.producto.marca) {
        Alertify.error('Ingresa la marca');
        return;
      }
      vm.producto.youtube_url = 'https://www.youtube.com/embed/' + vm.youtube_url;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.productoForm');
        return false;
      }

      // Create a new producto, or update the current instance
      vm.producto.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('productos.thumbnail', {
          productoId: res._id
        });
      }


      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
