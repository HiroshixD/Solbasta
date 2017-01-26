(function () {
  'use strict';

  angular
    .module('productos')
    .controller('SliderController', SliderController);

  SliderController.$inject = ['$scope', '$state', 'productoResolve', '$window', 'Authentication', 'CategoriasService', 'MarcasService', 'SliderService'];

  function SliderController($scope, $state, producto, $window, Authentication, CategoriasService, MarcasService, SliderService) {
    var vm = this;
    vm.producto = producto;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.categorias = CategoriasService.query();
    vm.marcas = MarcasService.query();

    vm.getAuctionsForSlider = function() {
      SliderService.getAuctions({
        success: function(response) {
          vm.auctions = response.data;
        },
        error: function(response) {
          console.log(response);
        }
      });
    };


    // Remove existing Producto
    function remove() {
      if ($window.confirm('Estás segur@ de eliminarlo??')) {
        vm.producto.$remove($state.go('productos.list'));
      }
    }

    // Save Producto
    function save(isValid) {
      vm.producto.nombre = 'SLIDER';
      vm.producto.codigo = 'SLIDER';
      vm.producto.thumbnail_1 = 'assets/imagenes/slider1.png';
      vm.producto.thumbnail_2 = 'assets/imagenes/slider2.png';
      vm.producto.thumbnail_3 = 'assets/imagenes/slider3.png';
      vm.producto.imagenUrl = 'assets/imagenes/slider4.png';
      vm.producto.thumbnail_1_mobil = 'assets/imagenes/slidermobil1.png';
      vm.producto.thumbnail_2_mobil = 'assets/imagenes/slidermobil2.png';
      vm.producto.thumbnail_3_mobil = 'assets/imagenes/slidermobil3.png';
      vm.producto.imagenUrl_mobil = 'assets/imagenes/slidermobil4.png';


      vm.producto.status = 0;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.productoForm');
        return false;
      }

      // Create a new producto, or update the current instance
      vm.producto.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('productos.sliderthumbnail', {
          productoId: res._id
        });
      }


      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
    vm.getAuctionsForSlider();
  }
}());
