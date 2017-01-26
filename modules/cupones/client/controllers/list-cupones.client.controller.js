(function () {
  'use strict';

  angular
    .module('cupones')
    .controller('CuponesListController', CuponesListController);

  CuponesListController.$inject = ['CuponesService'];

  function CuponesListController(CuponesService) {
    var vm = this;

    vm.cupones = CuponesService.query();
  }
}());
