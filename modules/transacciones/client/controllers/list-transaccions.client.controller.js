(function () {
  'use strict';

  angular
    .module('transaccions')
    .controller('TransaccionsListController', TransaccionsListController);

  TransaccionsListController.$inject = ['TransaccionsService'];

  function TransaccionsListController(TransaccionsService) {
    var vm = this;

    vm.transaccions = TransaccionsService.query();
  }
}());
