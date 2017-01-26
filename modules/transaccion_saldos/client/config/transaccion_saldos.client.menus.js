//  Dropdowns
(function () {
  'use strict';
// Inicio el modulo
  angular
    .module('transaccion_saldos')
    .run(menuConfig);
//  Le agrego la configuracion del menu, dropdown, con Transaccion_saldos, List Transaccion_saldos, Create Transaccion_saldo
  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Transaccion_saldos',
      state: 'transaccion_saldos',
      type: 'dropdown',
      roles: ['guest']
    });

    // Agregar la opción listar
    menuService.addSubMenuItem('topbar', 'transaccion_saldos', {
      title: 'List Transaccion_saldos',
      state: 'transaccion_saldos.list'
    });

    // Agregar la opción crear nuevo item
    menuService.addSubMenuItem('topbar', 'transaccion_saldos', {
      title: 'Create Transaccion_saldo',
      state: 'transaccion_saldos.create',
      roles: ['admin']
    });

  }
}());

