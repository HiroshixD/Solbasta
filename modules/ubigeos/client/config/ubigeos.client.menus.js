//  Dropdowns
(function () {
  'use strict';
// Inicio el modulo
  angular
    .module('ubigeos')
    .run(menuConfig);
//  Le agrego la configuracion del menu, dropdown, con Ubigeos, List Ubigeos, Create Ubigeo
  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Ubigeos',
      state: 'ubigeos',
      type: 'dropdown',
      roles: ['guest']
    });

    // Agregar la opción listar
    menuService.addSubMenuItem('topbar', 'ubigeos', {
      title: 'List Ubigeos',
      state: 'ubigeos.list'
    });

    // Agregar la opción crear nuevo item
    menuService.addSubMenuItem('topbar', 'ubigeos', {
      title: 'Create Ubigeo',
      state: 'ubigeos.create',
      roles: ['admin']
    });

  }
}());

