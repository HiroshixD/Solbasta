(function () {
  'use strict';

  angular
    .module('contactos.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('contactos', {
        abstract: true,
        url: '/contactos',
        template: '<ui-view/>'
      })
      .state('contactos.list', {
        url: '',
        templateUrl: 'modules/contactos/client/views/list-contactos.client.view.html',
        controller: 'ContactosListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Contactos List'
        }
      })
      .state('contactos.create', {
        url: '/create',
        templateUrl: 'modules/contactos/client/views/form-contacto.client.view.html',
        controller: 'ContactosController',
        controllerAs: 'vm',
        resolve: {
          contactoResolve: newContacto
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Crear articulo'
        }
      })
      .state('contactos.edit', {
        url: '/:contactoId/edit',
        templateUrl: 'modules/contactos/client/views/form-contacto.client.view.html',
        controller: 'ContactosController',
        controllerAs: 'vm',
        resolve: {
          contactoResolve: getContacto
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Contacto {{ contactoResolve.title }}'
        }
      })
      .state('contactos.view', {
        url: '/:contactoId',
        templateUrl: 'modules/contactos/client/views/view-contacto.client.view.html',
        controller: 'ContactosController',
        controllerAs: 'vm',
        resolve: {
          contactoResolve: getContacto
        },
        data: {
          pageTitle: 'Contacto {{ contactoResolve.title }}'
        }
      });
  }

  getContacto.$inject = ['$stateParams', 'ContactosService'];

  function getContacto($stateParams, ContactosService) {
    return ContactosService.get({
      contactoId: $stateParams.contactoId
    }).$promise;
  }

  newContacto.$inject = ['ContactosService'];

  function newContacto(ContactosService) {
    return new ContactosService();
  }
}());
