//  Dropdowns
(function () {
  'use strict';
// Inicio el modulo
  angular
    .module('contactos')
    .run(menuConfig);
//  Le agrego la configuracion del menu, dropdown, con Contactos, List Contactos, Create Contacto
  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Contactos',
      state: 'contactos',
      type: 'dropdown',
      roles: ['guest']
    });

    // Agregar la opción listar
    menuService.addSubMenuItem('topbar', 'contactos', {
      title: 'List Contactos',
      state: 'contactos.list'
    });

    // Agregar la opción crear nuevo item
    menuService.addSubMenuItem('topbar', 'contactos', {
      title: 'Create Contacto',
      state: 'contactos.create',
      roles: ['admin']
    });

  }
}());

