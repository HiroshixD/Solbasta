(function () {
  'use strict';

  describe('Datos_envios List Controller Tests', function () {
    // Initialize global variables
    var Datos_enviosListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      Datos_enviosService,
      mockDatos_envio;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _Datos_enviosService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      Datos_enviosService = _Datos_enviosService_;

      // create mock datos_envio
      mockDatos_envio = new Datos_enviosService({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Datos_envio about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Datos_envios List controller.
      Datos_enviosListController = $controller('Datos_enviosListController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockDatos_envioList;

      beforeEach(function () {
        mockDatos_envioList = [mockDatos_envio, mockDatos_envio];
      });

      it('should send a GET request and return all datos_envios', inject(function (Datos_enviosService) {
        // Set POST response
        $httpBackend.expectGET('api/datos_envios').respond(mockDatos_envioList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.datos_envios.length).toEqual(2);
        expect($scope.vm.datos_envios[0]).toEqual(mockDatos_envio);
        expect($scope.vm.datos_envios[1]).toEqual(mockDatos_envio);

      }));
    });
  });
}());
