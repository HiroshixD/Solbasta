//  Dropdowns
(function () {
  'use strict';
// Inicio el modulo
  angular
    .module('categorias')
    .run(menuConfig);
//  Le agrego la configuracion del menu, dropdown, con Categorias, List Categorias, Create Categoria
  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Categorias',
      state: 'categorias',
      type: 'dropdown',
      roles: ['admin']
    });

    // Agregar la opción listar
    menuService.addSubMenuItem('topbar', 'categorias', {
      title: 'Listar Categorias',
      state: 'categorias.list'
    });

    // Agregar la opción crear nuevo item
    menuService.addSubMenuItem('topbar', 'categorias', {
      title: 'Crear Categoria',
      state: 'categorias.create',
      roles: ['admin']
    });

  }
}());

