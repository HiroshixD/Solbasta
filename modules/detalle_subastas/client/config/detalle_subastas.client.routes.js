(function () {
  'use strict';

  angular
    .module('detalle_subastas.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('detalle_subastas', {
        abstract: true,
        url: '/admin/detalle_subastas',
        template: '<ui-view/>'
      })
      .state('detalle_subastas.list', {
        url: '',
        templateUrl: 'modules/detalle_subastas/client/views/list-detalle_subastas.client.view.html',
        controller: 'Detalle_subastasListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Detalle_subastas List'
        }
      })
      .state('detalle_subastas.create', {
        url: '/create',
        templateUrl: 'modules/detalle_subastas/client/views/form-detalle_subasta.client.view.html',
        controller: 'Detalle_subastasController',
        controllerAs: 'vm',
        resolve: {
          detalle_subastaResolve: newDetalle_subasta
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Crear una nueva subasta'
        }
      })
      .state('detalle_subastas.edit', {
        url: '/:detalle_subastaId/edit',
        templateUrl: 'modules/detalle_subastas/client/views/form-detalle_subasta.client.view.html',
        controller: 'Detalle_subastasController',
        controllerAs: 'vm',
        resolve: {
          detalle_subastaResolve: getDetalle_subasta
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Detalle_subasta {{ detalle_subastaResolve.title }}'
        }
      })
      .state('detalle_subastas.view', {
        url: '/:detalle_subastaId',
        templateUrl: 'modules/detalle_subastas/client/views/view-detalle_subasta.client.view.html',
        controller: 'Detalle_subastasController',
        controllerAs: 'vm',
        resolve: {
          detalle_subastaResolve: getDetalle_subasta
        },
        data: {
          pageTitle: 'Detalle de subasta {{ detalle_subastaResolve.titulo }}'
        }
      });
  }

  getDetalle_subasta.$inject = ['$stateParams', 'Detalle_subastasService'];

  function getDetalle_subasta($stateParams, Detalle_subastasService) {
    return Detalle_subastasService.get({
      detalle_subastaId: $stateParams.detalle_subastaId
    }).$promise;
  }

  newDetalle_subasta.$inject = ['Detalle_subastasService'];

  function newDetalle_subasta(Detalle_subastasService) {
    return new Detalle_subastasService();
  }
}());
