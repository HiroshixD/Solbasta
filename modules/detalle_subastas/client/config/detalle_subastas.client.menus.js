//  Dropdowns
(function () {
  'use strict';
// Inicio el modulo
  angular
    .module('detalle_subastas')
    .run(menuConfig);
//  Le agrego la configuracion del menu, dropdown, con Detalle_subastas, List Detalle_subastas, Create Detalle_subasta
  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Subastas',
      state: 'detalle_subastas',
      type: 'dropdown',
      roles: ['admin']
    });

    // Agregar la opción listar
    menuService.addSubMenuItem('topbar', 'detalle_subastas', {
      title: 'Todas las subastas',
      state: 'detalle_subastas.list'
    });

    // Agregar la opción crear nuevo item
    menuService.addSubMenuItem('topbar', 'detalle_subastas', {
      title: 'Crear una subasta',
      state: 'detalle_subastas.create',
      roles: ['admin']
    });

  }
}());

