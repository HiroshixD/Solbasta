//  Dropdowns
(function () {
  'use strict';
// Inicio el modulo
  angular
    .module('testimonios')
    .run(menuConfig);
//  Le agrego la configuracion del menu, dropdown, con Testimonios, List Testimonios, Create Testimonio
  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Testimonios',
      state: 'testimonios',
      type: 'dropdown',
      roles: ['guest']
    });

    // Agregar la opción listar
    menuService.addSubMenuItem('topbar', 'testimonios', {
      title: 'List Testimonios',
      state: 'testimonios.list'
    });

    // Agregar la opción crear nuevo item
    menuService.addSubMenuItem('topbar', 'testimonios', {
      title: 'Create Testimonio',
      state: 'testimonios.create',
      roles: ['admin']
    });

  }
}());

