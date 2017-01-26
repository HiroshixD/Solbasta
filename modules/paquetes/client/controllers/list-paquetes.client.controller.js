(function () {
  'use strict';

  angular
    .module('paquetes')
    .controller('PaquetesListController', PaquetesListController);

  PaquetesListController.$inject = ['PaquetesService'];

  function PaquetesListController(PaquetesService) {
    var vm = this;

    vm.paquetes = PaquetesService.query();
  }
}());
