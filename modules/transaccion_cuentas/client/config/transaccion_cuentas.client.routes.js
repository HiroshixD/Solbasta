(function () {
  'use strict';

  angular
    .module('transaccion_cuentas.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('transaccion_cuentas', {
        abstract: true,
        url: '/transaccion_cuentas',
        template: '<ui-view/>'
      })
      .state('transaccion_cuentas.list', {
        url: '',
        templateUrl: 'modules/transaccion_cuentas/client/views/list-transaccion_cuentas.client.view.html',
        controller: 'Transaccion_cuentasListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Transaccion_cuentas List'
        }
      })
      .state('transaccion_cuentas.create', {
        url: '/create',
        templateUrl: 'modules/transaccion_cuentas/client/views/form-transaccion_cuenta.client.view.html',
        controller: 'Transaccion_cuentasController',
        controllerAs: 'vm',
        resolve: {
          transaccion_cuentaResolve: newTransaccion_cuenta
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Crear articulo'
        }
      })
      .state('transaccion_cuentas.edit', {
        url: '/:transaccion_cuentaId/edit',
        templateUrl: 'modules/transaccion_cuentas/client/views/form-transaccion_cuenta.client.view.html',
        controller: 'Transaccion_cuentasController',
        controllerAs: 'vm',
        resolve: {
          transaccion_cuentaResolve: getTransaccion_cuenta
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Transaccion_cuenta {{ transaccion_cuentaResolve.title }}'
        }
      })
      .state('transaccion_cuentas.view', {
        url: '/:transaccion_cuentaId',
        templateUrl: 'modules/transaccion_cuentas/client/views/view-transaccion_cuenta.client.view.html',
        controller: 'Transaccion_cuentasController',
        controllerAs: 'vm',
        resolve: {
          transaccion_cuentaResolve: getTransaccion_cuenta
        },
        data: {
          pageTitle: 'Transaccion_cuenta {{ transaccion_cuentaResolve.title }}'
        }
      });
  }

  getTransaccion_cuenta.$inject = ['$stateParams', 'Transaccion_cuentasService'];

  function getTransaccion_cuenta($stateParams, Transaccion_cuentasService) {
    return Transaccion_cuentasService.get({
      transaccion_cuentaId: $stateParams.transaccion_cuentaId
    }).$promise;
  }

  newTransaccion_cuenta.$inject = ['Transaccion_cuentasService'];

  function newTransaccion_cuenta(Transaccion_cuentasService) {
    return new Transaccion_cuentasService();
  }
}());
