//  Dropdowns
(function () {
  'use strict';
// Inicio el modulo
  angular
    .module('marcas')
    .run(menuConfig);
//  Le agrego la configuracion del menu, dropdown, con Marcas, List Marcas, Create Marca
  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Marcas',
      state: 'marcas',
      type: 'dropdown',
      roles: ['admin']
    });

    // Agregar la opción listar
    menuService.addSubMenuItem('topbar', 'marcas', {
      title: 'Listar Marcas',
      state: 'marcas.list'
    });

    // Agregar la opción crear nuevo item
    menuService.addSubMenuItem('topbar', 'marcas', {
      title: 'Crear Marca',
      state: 'marcas.create',
      roles: ['admin']
    });

  }
}());

