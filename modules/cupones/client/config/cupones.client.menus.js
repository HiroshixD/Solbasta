//  Dropdowns
(function () {
  'use strict';
// Inicio el modulo
  angular
    .module('cupones')
    .run(menuConfig);
//  Le agrego la configuracion del menu, dropdown, con Cupones, List Cupones, Create Cupone
  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Cupones',
      state: 'cupones',
      type: 'dropdown',
      roles: ['guest']
    });

    // Agregar la opción listar
    menuService.addSubMenuItem('topbar', 'cupones', {
      title: 'Listar Cupones',
      state: 'cupones.list'
    });

    // Agregar la opción crear nuevo item
    menuService.addSubMenuItem('topbar', 'cupones', {
      title: 'Crear Cupon',
      state: 'cupones.create',
      roles: ['admin']
    });

  }
}());

