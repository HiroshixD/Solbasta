(function () {
  'use strict';

  angular
    .module('productos')
    .controller('ProductosListController', ProductosListController);

  ProductosListController.$inject = ['ProductosService'];

  function ProductosListController(ProductosService) {
    var vm = this;

    vm.productos = ProductosService.query();
  }
}());
