(function () {
  'use strict';

  angular
    .module('transaccion_saldos')
    .controller('Transaccion_saldosListController', Transaccion_saldosListController);

  Transaccion_saldosListController.$inject = ['Transaccion_saldosService'];

  function Transaccion_saldosListController(Transaccion_saldosService) {
    var vm = this;

    vm.transaccion_saldos = Transaccion_saldosService.query();
  }
}());
