//  Dropdowns
(function () {
  'use strict';
// Inicio el modulo
  angular
    .module('productos')
    .run(menuConfig);
//  Le agrego la configuracion del menu, dropdown, con Productos, List Productos, Create Producto
  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Productos',
      state: 'productos',
      type: 'dropdown',
      roles: ['admin']
    });

    // Agregar la opción listar
    menuService.addSubMenuItem('topbar', 'productos', {
      title: 'Listar Productos',
      state: 'productos.list'
    });

    // Agregar la opción crear nuevo item
    menuService.addSubMenuItem('topbar', 'productos', {
      title: 'Crear Producto',
      state: 'productos.create',
      roles: ['admin']
    });

  }
}());

