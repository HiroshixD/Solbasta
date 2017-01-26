(function () {
  'use strict';

  angular
    .module('transaccion_cuentas')
    .controller('Transaccion_cuentasListController', Transaccion_cuentasListController);

  Transaccion_cuentasListController.$inject = ['Transaccion_cuentasService'];

  function Transaccion_cuentasListController(Transaccion_cuentasService) {
    var vm = this;

    vm.transaccion_cuentas = Transaccion_cuentasService.query();
  }
}());
