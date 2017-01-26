(function () {
  'use strict';

  angular
    .module('transaccions.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('transaccions', {
        abstract: true,
        url: '/transaccions',
        template: '<ui-view/>'
      })
      .state('transaccions.list', {
        url: '',
        templateUrl: 'modules/transaccions/client/views/list-transaccions.client.view.html',
        controller: 'TransaccionsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Transaccions List'
        }
      })
      .state('transaccions.create', {
        url: '/create',
        templateUrl: 'modules/transaccions/client/views/form-transaccion.client.view.html',
        controller: 'TransaccionsController',
        controllerAs: 'vm',
        resolve: {
          transaccionResolve: newTransaccion
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Crear articulo'
        }
      })
      .state('transaccions.edit', {
        url: '/:transaccionId/edit',
        templateUrl: 'modules/transaccions/client/views/form-transaccion.client.view.html',
        controller: 'TransaccionsController',
        controllerAs: 'vm',
        resolve: {
          transaccionResolve: getTransaccion
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Transaccion {{ transaccionResolve.title }}'
        }
      })
      .state('transaccions.view', {
        url: '/:transaccionId',
        templateUrl: 'modules/transaccions/client/views/view-transaccion.client.view.html',
        controller: 'TransaccionsController',
        controllerAs: 'vm',
        resolve: {
          transaccionResolve: getTransaccion
        },
        data: {
          pageTitle: 'Transaccion {{ transaccionResolve.title }}'
        }
      });
  }

  getTransaccion.$inject = ['$stateParams', 'TransaccionsService'];

  function getTransaccion($stateParams, TransaccionsService) {
    return TransaccionsService.get({
      transaccionId: $stateParams.transaccionId
    }).$promise;
  }

  newTransaccion.$inject = ['TransaccionsService'];

  function newTransaccion(TransaccionsService) {
    return new TransaccionsService();
  }
}());
