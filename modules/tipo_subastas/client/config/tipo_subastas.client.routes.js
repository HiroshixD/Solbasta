(function () {
  'use strict';

  angular
    .module('tipo_subastas.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('tipo_subastas', {
        abstract: true,
        url: '/admin/tipo_subastas',
        template: '<ui-view/>'
      })
      .state('tipo_subastas.list', {
        url: '',
        templateUrl: 'modules/tipo_subastas/client/views/list-tipo_subastas.client.view.html',
        controller: 'Tipo_subastasListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Listar subastas'
        }
      })
      .state('tipo_subastas.create', {
        url: '/create',
        templateUrl: 'modules/tipo_subastas/client/views/form-tipo_subasta.client.view.html',
        controller: 'Tipo_subastasController',
        controllerAs: 'vm',
        resolve: {
          tipo_subastaResolve: newTipo_subasta
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Crear nuevo tipo de subasta'
        }
      })
      .state('tipo_subastas.edit', {
        url: '/:tipo_subastaId/edit',
        templateUrl: 'modules/tipo_subastas/client/views/form-tipo_subasta.client.view.html',
        controller: 'Tipo_subastasController',
        controllerAs: 'vm',
        resolve: {
          tipo_subastaResolve: getTipo_subasta
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Editar Tipo de subasta {{ tipo_subastaResolve.title }}'
        }
      })
      .state('tipo_subastas.view', {
        url: '/:tipo_subastaId',
        templateUrl: 'modules/tipo_subastas/client/views/view-tipo_subasta.client.view.html',
        controller: 'Tipo_subastasController',
        controllerAs: 'vm',
        resolve: {
          tipo_subastaResolve: getTipo_subasta
        },
        data: {
          pageTitle: 'Ver tipo de subasta {{ tipo_subastaResolve.title }}'
        }
      });
  }

  getTipo_subasta.$inject = ['$stateParams', 'Tipo_subastasService'];

  function getTipo_subasta($stateParams, Tipo_subastasService) {
    return Tipo_subastasService.get({
      tipo_subastaId: $stateParams.tipo_subastaId
    }).$promise;
  }

  newTipo_subasta.$inject = ['Tipo_subastasService'];

  function newTipo_subasta(Tipo_subastasService) {
    return new Tipo_subastasService();
  }
}());
