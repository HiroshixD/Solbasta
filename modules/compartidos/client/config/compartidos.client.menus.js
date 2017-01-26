//  Dropdowns
(function () {
  'use strict';
// Inicio el modulo
  angular
    .module('compartidos')
    .run(menuConfig);
//  Le agrego la configuracion del menu, dropdown, con Compartidos, List Compartidos, Create Compartido
  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Compartidos',
      state: 'compartidos',
      type: 'dropdown',
      roles: ['guest']
    });

    // Agregar la opción listar
    menuService.addSubMenuItem('topbar', 'compartidos', {
      title: 'List Compartidos',
      state: 'compartidos.list'
    });

    // Agregar la opción crear nuevo item
    menuService.addSubMenuItem('topbar', 'compartidos', {
      title: 'Create Compartido',
      state: 'compartidos.create',
      roles: ['admin']
    });

  }
}());

