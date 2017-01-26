//  Dropdowns
(function () {
  'use strict';
// Inicio el modulo
  angular
    .module('eventos')
    .run(menuConfig);
//  Le agrego la configuracion del menu, dropdown, con Eventos, List Eventos, Create Evento
  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Eventos',
      state: 'eventos',
      type: 'dropdown',
      roles: ['guest']
    });

    // Agregar la opción listar
    menuService.addSubMenuItem('topbar', 'eventos', {
      title: 'List Eventos',
      state: 'eventos.list'
    });

    // Agregar la opción crear nuevo item
    menuService.addSubMenuItem('topbar', 'eventos', {
      title: 'Create Evento',
      state: 'eventos.create',
      roles: ['admin']
    });

  }
}());

