(function () {
  'use strict';

  angular
    .module('datos_envios')
    .controller('Datos_enviosListController', Datos_enviosListController);

  Datos_enviosListController.$inject = ['Datos_enviosService'];

  function Datos_enviosListController(Datos_enviosService) {
    var vm = this;

    vm.datos_envios = Datos_enviosService.query();
  }
}());
