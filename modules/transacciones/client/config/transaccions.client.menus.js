//  Dropdowns
(function () {
  'use strict';
// Inicio el modulo
  angular
    .module('transaccions')
    .run(menuConfig);
//  Le agrego la configuracion del menu, dropdown, con Transaccions, List Transaccions, Create Transaccion
  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Transaccions',
      state: 'transaccions',
      type: 'dropdown',
      roles: ['guest']
    });

    // Agregar la opción listar
    menuService.addSubMenuItem('topbar', 'transaccions', {
      title: 'List Transaccions',
      state: 'transaccions.list'
    });

    // Agregar la opción crear nuevo item
    menuService.addSubMenuItem('topbar', 'transaccions', {
      title: 'Create Transaccion',
      state: 'transaccions.create',
      roles: ['admin']
    });

  }
}());

