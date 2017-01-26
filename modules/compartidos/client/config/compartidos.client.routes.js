(function () {
  'use strict';

  angular
    .module('compartidos.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('compartidos', {
        abstract: true,
        url: '/admin/compartidos',
        template: '<ui-view/>'
      })
      .state('compartidos.list', {
        url: '',
        templateUrl: 'modules/compartidos/client/views/list-compartidos.client.view.html',
        controller: 'CompartidosListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Compartidos List'
        }
      })
      .state('compartidos.create', {
        url: '/create',
        templateUrl: 'modules/compartidos/client/views/form-compartido.client.view.html',
        controller: 'CompartidosController',
        controllerAs: 'vm',
        resolve: {
          compartidoResolve: newCompartido
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Crear articulo'
        }
      })
      .state('compartidos.edit', {
        url: '/:compartidoId/edit',
        templateUrl: 'modules/compartidos/client/views/form-compartido.client.view.html',
        controller: 'CompartidosController',
        controllerAs: 'vm',
        resolve: {
          compartidoResolve: getCompartido
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Compartido {{ compartidoResolve.title }}'
        }
      })
      .state('compartidos.view', {
        url: '/:compartidoId',
        templateUrl: 'modules/compartidos/client/views/view-compartido.client.view.html',
        controller: 'CompartidosController',
        controllerAs: 'vm',
        resolve: {
          compartidoResolve: getCompartido
        },
        data: {
          pageTitle: 'Compartido {{ compartidoResolve.title }}'
        }
      });
  }

  getCompartido.$inject = ['$stateParams', 'CompartidosService'];

  function getCompartido($stateParams, CompartidosService) {
    return CompartidosService.get({
      compartidoId: $stateParams.compartidoId
    }).$promise;
  }

  newCompartido.$inject = ['CompartidosService'];

  function newCompartido(CompartidosService) {
    return new CompartidosService();
  }
}());
