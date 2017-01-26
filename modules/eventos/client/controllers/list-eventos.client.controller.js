(function () {
  'use strict';

  angular
    .module('eventos')
    .controller('EventosListController', EventosListController);

  EventosListController.$inject = ['EventosService'];

  function EventosListController(EventosService) {
    var vm = this;

    vm.eventos = EventosService.query();
  }
}());
