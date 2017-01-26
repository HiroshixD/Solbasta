(function () {
  'use strict';

  angular
    .module('testimonios.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('testimonios', {
        abstract: true,
        url: '/testimonios',
        template: '<ui-view/>'
      })
      .state('testimonios.list', {
        url: '',
        templateUrl: 'modules/testimonios/client/views/list-testimonios.client.view.html',
        controller: 'TestimoniosListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Testimonios List'
        }
      })
      .state('testimonios.create', {
        url: '/create',
        templateUrl: 'modules/testimonios/client/views/form-testimonio.client.view.html',
        controller: 'TestimoniosController',
        controllerAs: 'vm',
        resolve: {
          testimonioResolve: newTestimonio
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Crear Testimonio'
        }
      })
      .state('testimonios.edit', {
        url: '/:testimonioId/edit',
        templateUrl: 'modules/testimonios/client/views/form-testimonio.client.view.html',
        controller: 'TestimoniosController',
        controllerAs: 'vm',
        resolve: {
          testimonioResolve: getTestimonio
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Testimonio {{ testimonioResolve.title }}'
        }
      })
      .state('testimonios.view', {
        url: '/:testimonioId',
        templateUrl: 'modules/testimonios/client/views/view-testimonio.client.view.html',
        controller: 'TestimoniosController',
        controllerAs: 'vm',
        resolve: {
          testimonioResolve: getTestimonio
        },
        data: {
          pageTitle: 'Testimonio {{ testimonioResolve.title }}'
        }
      });
  }

  getTestimonio.$inject = ['$stateParams', 'TestimoniosService'];

  function getTestimonio($stateParams, TestimoniosService) {
    return TestimoniosService.get({
      testimonioId: $stateParams.testimonioId
    }).$promise;
  }

  newTestimonio.$inject = ['TestimoniosService'];

  function newTestimonio(TestimoniosService) {
    return new TestimoniosService();
  }
}());
