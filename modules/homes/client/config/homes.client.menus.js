//  Dropdowns
(function () {
  'use strict';
// Inicio el modulo
  angular
    .module('homes')
    .run(menuConfig);
//  Le agrego la configuracion del menu, dropdown, con Homes, List Homes, Create Home
  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Homes',
      state: 'homes',
      type: 'dropdown',
      roles: ['guest']
    });

    // Agregar la opción listar
    menuService.addSubMenuItem('topbar', 'homes', {
      title: 'List Homes',
      state: 'homes.list'
    });

    // Agregar la opción crear nuevo item
    menuService.addSubMenuItem('topbar', 'homes', {
      title: 'Create Home',
      state: 'homes.create',
      roles: ['guest']
    });

  }
}());

