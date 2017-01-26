//  Dropdowns
(function () {
  'use strict';
// Inicio el modulo
  angular
    .module('cuentas')
    .run(menuConfig);
//  Le agrego la configuracion del menu, dropdown, con Cuentas, List Cuentas, Create Cuenta
  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Cuentas',
      state: 'cuentas',
      type: 'dropdown',
      roles: ['guest']
    });

    // Agregar la opción listar
    menuService.addSubMenuItem('topbar', 'cuentas', {
      title: 'List Cuentas',
      state: 'cuentas.list'
    });

    // Agregar la opción crear nuevo item
    menuService.addSubMenuItem('topbar', 'cuentas', {
      title: 'Create Cuenta',
      state: 'cuentas.create',
      roles: ['admin']
    });

  }
}());

