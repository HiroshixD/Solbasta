(function () {
  'use strict';

  angular
    .module('eventos.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('eventos', {
        abstract: true,
        url: '/eventos',
        template: '<ui-view/>'
      })
      .state('eventos.list', {
        url: '',
        templateUrl: 'modules/eventos/client/views/list-eventos.client.view.html',
        controller: 'EventosListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Eventos List'
        }
      })
      .state('eventos.create', {
        url: '/create',
        templateUrl: 'modules/eventos/client/views/form-evento.client.view.html',
        controller: 'EventosController',
        controllerAs: 'vm',
        resolve: {
          eventoResolve: newEvento
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Crear articulo'
        }
      })
      .state('eventos.edit', {
        url: '/:eventoId/edit',
        templateUrl: 'modules/eventos/client/views/form-evento.client.view.html',
        controller: 'EventosController',
        controllerAs: 'vm',
        resolve: {
          eventoResolve: getEvento
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Evento {{ eventoResolve.title }}'
        }
      })
      .state('eventos.view', {
        url: '/:eventoId',
        templateUrl: 'modules/eventos/client/views/view-evento.client.view.html',
        controller: 'EventosController',
        controllerAs: 'vm',
        resolve: {
          eventoResolve: getEvento
        },
        data: {
          pageTitle: 'Evento {{ eventoResolve.title }}'
        }
      });
  }

  getEvento.$inject = ['$stateParams', 'EventosService'];

  function getEvento($stateParams, EventosService) {
    return EventosService.get({
      eventoId: $stateParams.eventoId
    }).$promise;
  }

  newEvento.$inject = ['EventosService'];

  function newEvento(EventosService) {
    return new EventosService();
  }
}());
