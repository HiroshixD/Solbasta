//  Dropdowns
(function () {
  'use strict';
// Inicio el modulo
  angular
    .module('transaccion_cuentas')
    .run(menuConfig);
//  Le agrego la configuracion del menu, dropdown, con Transaccion_cuentas, List Transaccion_cuentas, Create Transaccion_cuenta
  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Transaccion_cuentas',
      state: 'transaccion_cuentas',
      type: 'dropdown',
      roles: ['guest']
    });

    // Agregar la opción listar
    menuService.addSubMenuItem('topbar', 'transaccion_cuentas', {
      title: 'List Transaccion_cuentas',
      state: 'transaccion_cuentas.list'
    });

    // Agregar la opción crear nuevo item
    menuService.addSubMenuItem('topbar', 'transaccion_cuentas', {
      title: 'Create Transaccion_cuenta',
      state: 'transaccion_cuentas.create',
      roles: ['admin']
    });

  }
}());

