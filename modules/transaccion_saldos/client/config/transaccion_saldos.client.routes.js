(function () {
  'use strict';

  angular
    .module('transaccion_saldos.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('transaccion_saldos', {
        abstract: true,
        url: '/transaccion_saldos',
        template: '<ui-view/>'
      })
      .state('transaccion_saldos.list', {
        url: '',
        templateUrl: 'modules/transaccion_saldos/client/views/list-transaccion_saldos.client.view.html',
        controller: 'Transaccion_saldosListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Transaccion_saldos List'
        }
      })
      .state('transaccion_saldos.create', {
        url: '/create',
        templateUrl: 'modules/transaccion_saldos/client/views/form-transaccion_saldo.client.view.html',
        controller: 'Transaccion_saldosController',
        controllerAs: 'vm',
        resolve: {
          transaccion_saldoResolve: newTransaccion_saldo
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Crear articulo'
        }
      })
      .state('transaccion_saldos.edit', {
        url: '/:transaccion_saldoId/edit',
        templateUrl: 'modules/transaccion_saldos/client/views/form-transaccion_saldo.client.view.html',
        controller: 'Transaccion_saldosController',
        controllerAs: 'vm',
        resolve: {
          transaccion_saldoResolve: getTransaccion_saldo
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Transaccion_saldo {{ transaccion_saldoResolve.title }}'
        }
      })
      .state('transaccion_saldos.view', {
        url: '/:transaccion_saldoId',
        templateUrl: 'modules/transaccion_saldos/client/views/view-transaccion_saldo.client.view.html',
        controller: 'Transaccion_saldosController',
        controllerAs: 'vm',
        resolve: {
          transaccion_saldoResolve: getTransaccion_saldo
        },
        data: {
          pageTitle: 'Transaccion_saldo {{ transaccion_saldoResolve.title }}'
        }
      });
  }

  getTransaccion_saldo.$inject = ['$stateParams', 'Transaccion_saldosService'];

  function getTransaccion_saldo($stateParams, Transaccion_saldosService) {
    return Transaccion_saldosService.get({
      transaccion_saldoId: $stateParams.transaccion_saldoId
    }).$promise;
  }

  newTransaccion_saldo.$inject = ['Transaccion_saldosService'];

  function newTransaccion_saldo(Transaccion_saldosService) {
    return new Transaccion_saldosService();
  }
}());
