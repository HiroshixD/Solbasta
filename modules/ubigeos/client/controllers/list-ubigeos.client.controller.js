(function () {
  'use strict';

  angular
    .module('ubigeos')
    .controller('UbigeosListController', UbigeosListController);

  UbigeosListController.$inject = ['UbigeosService'];

  function UbigeosListController(UbigeosService) {
    var vm = this;

    vm.ubigeos = UbigeosService.query();
  }
}());
