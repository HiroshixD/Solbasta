(function () {
  'use strict';

  angular
    .module('contactos')
    .controller('ContactosListController', ContactosListController);

  ContactosListController.$inject = ['ContactosService'];

  function ContactosListController(ContactosService) {
    var vm = this;

    vm.contactos = ContactosService.query();
  }
}());
