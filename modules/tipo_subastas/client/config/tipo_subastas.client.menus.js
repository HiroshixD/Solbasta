//  Dropdowns
(function () {
  'use strict';
// Inicio el modulo
  angular
    .module('tipo_subastas')
    .run(menuConfig);
//  Le agrego la configuracion del menu, dropdown, con Tipo_subastas, List Tipo_subastas, Create Tipo_subasta
  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Tipos de subasta',
      state: 'tipo_subastas',
      type: 'dropdown',
      roles: ['guest']
    });

    // Agregar la opción listar
    menuService.addSubMenuItem('topbar', 'tipo_subastas', {
      title: 'Listar todos',
      state: 'tipo_subastas.list'
    });

    // Agregar la opción crear nuevo item
    menuService.addSubMenuItem('topbar', 'tipo_subastas', {
      title: 'Crear uno',
      state: 'tipo_subastas.create',
      roles: ['admin']
    });

  }
}());

