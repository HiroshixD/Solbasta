//  Dropdowns
(function () {
  'use strict';
// Inicio el modulo
  angular
    .module('paquetes')
    .run(menuConfig);
//  Le agrego la configuracion del menu, dropdown, con Paquetes, List Paquetes, Create Paquete
  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Paquetes',
      state: 'paquetes',
      type: 'dropdown',
      roles: ['admin']
    });

    // Agregar la opción listar
    menuService.addSubMenuItem('topbar', 'paquetes', {
      title: 'Listar Paquetes',
      state: 'paquetes.list'
    });

    // Agregar la opción crear nuevo item
    menuService.addSubMenuItem('topbar', 'paquetes', {
      title: 'Crear Paquete',
      state: 'paquetes.create',
      roles: ['admin']
    });

  }
}());

