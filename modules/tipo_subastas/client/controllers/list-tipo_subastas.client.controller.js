(function () {
  'use strict';

  angular
    .module('tipo_subastas')
    .controller('Tipo_subastasListController', Tipo_subastasListController);

  Tipo_subastasListController.$inject = ['Tipo_subastasService'];

  function Tipo_subastasListController(Tipo_subastasService) {
    var vm = this;

    vm.tipo_subastas = Tipo_subastasService.query();
  }
}());
