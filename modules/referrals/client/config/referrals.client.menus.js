//  Dropdowns
(function () {
  'use strict';
// Inicio el modulo
  angular
    .module('referrals')
    .run(menuConfig);
//  Le agrego la configuracion del menu, dropdown, con Referrals, List Referrals, Create Referral
  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Referrals',
      state: 'referrals',
      type: 'dropdown',
      roles: ['guest']
    });

    // Agregar la opción listar
    menuService.addSubMenuItem('topbar', 'referrals', {
      title: 'List Referrals',
      state: 'referrals.list'
    });

    // Agregar la opción crear nuevo item
    menuService.addSubMenuItem('topbar', 'referrals', {
      title: 'Create Referral',
      state: 'referrals.create',
      roles: ['admin']
    });

  }
}());

