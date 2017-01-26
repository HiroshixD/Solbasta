(function () {
  'use strict';

  angular
    .module('cuentas.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('cuentas', {
        abstract: true,
        url: '/admin/cuentas',
        template: '<ui-view/>'
      })
      .state('cuentas.admin', {
        url: '/admin',
        templateUrl: 'modules/cuentas/client/views/admin-cuentas.client.view.html',
        controller: 'AdminCuentasController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Administrar cuentas'
        }
      })
      .state('cuentas.chat', {
        url: '/chat',
        templateUrl: 'modules/cuentas/client/views/admin-chat.client.view.html',
        controller: 'AdminCuentasController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Chat'
        }
      });
  }

  getCuenta.$inject = ['$stateParams', 'CuentasService'];

  function getCuenta($stateParams, CuentasService) {
    return CuentasService.get({
      cuentaId: $stateParams.cuentaId
    }).$promise;
  }

  newCuenta.$inject = ['CuentasService'];

  function newCuenta(CuentasService) {
    return new CuentasService();
  }
}());
