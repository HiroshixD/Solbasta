//  Dropdowns
(function () {
  'use strict';
// Inicio el modulo
  angular
    .module('datos_envios')
    .run(menuConfig);
//  Le agrego la configuracion del menu, dropdown, con Datos_envios, List Datos_envios, Create Datos_envio
  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Datos_envios',
      state: 'datos_envios',
      type: 'dropdown',
      roles: ['guest']
    });

    // Agregar la opción listar
    menuService.addSubMenuItem('topbar', 'datos_envios', {
      title: 'List Datos_envios',
      state: 'datos_envios.list'
    });

    // Agregar la opción crear nuevo item
    menuService.addSubMenuItem('topbar', 'datos_envios', {
      title: 'Create Datos_envio',
      state: 'datos_envios.create',
      roles: ['admin']
    });

  }
}());

