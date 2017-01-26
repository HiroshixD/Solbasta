(function () {
  'use strict';

  angular
    .module('compartidos')
    .controller('CompartidosListController', CompartidosListController);

  CompartidosListController.$inject = ['CompartidosService'];

  function CompartidosListController(CompartidosService) {
    var vm = this;

    vm.compartidos = CompartidosService.query();
  }
}());
