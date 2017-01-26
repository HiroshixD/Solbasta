//  Dropdowns
(function () {
  'use strict';
// Inicio el modulo
  angular
    .module('reminders')
    .run(menuConfig);
//  Le agrego la configuracion del menu, dropdown, con Reminders, List Reminders, Create Reminder
  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Reminders',
      state: 'reminders',
      type: 'dropdown',
      roles: ['guest']
    });

    // Agregar la opción listar
    menuService.addSubMenuItem('topbar', 'reminders', {
      title: 'List Reminders',
      state: 'reminders.list'
    });

    // Agregar la opción crear nuevo item
    menuService.addSubMenuItem('topbar', 'reminders', {
      title: 'Create Reminder',
      state: 'reminders.create',
      roles: ['admin']
    });

  }
}());

