(function () {
  'use strict';

  angular
    .module('categorias')
    .controller('CategoriasListController', CategoriasListController);

  CategoriasListController.$inject = ['$rootScope', 'CategoriasService', 'CategoriaAuctionService', '$stateParams'];

  function CategoriasListController($rootScope, CategoriasService, CategoriaAuctionService, $stateParams) {
    var vm = this;
    $rootScope.bodyClass = "cat-subastas";
    vm.categorias = CategoriasService.query();
  }
}());
