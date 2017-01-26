(function () {
  'use strict';

  describe('Tipo_subastas List Controller Tests', function () {
    // Initialize global variables
    var Tipo_subastasListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      Tipo_subastasService,
      mockTipo_subasta;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _Tipo_subastasService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      Tipo_subastasService = _Tipo_subastasService_;

      // create mock tipo_subasta
      mockTipo_subasta = new Tipo_subastasService({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Tipo_subasta about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Tipo_subastas List controller.
      Tipo_subastasListController = $controller('Tipo_subastasListController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockTipo_subastaList;

      beforeEach(function () {
        mockTipo_subastaList = [mockTipo_subasta, mockTipo_subasta];
      });

      it('should send a GET request and return all tipo_subastas', inject(function (Tipo_subastasService) {
        // Set POST response
        $httpBackend.expectGET('api/tipo_subastas').respond(mockTipo_subastaList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.tipo_subastas.length).toEqual(2);
        expect($scope.vm.tipo_subastas[0]).toEqual(mockTipo_subasta);
        expect($scope.vm.tipo_subastas[1]).toEqual(mockTipo_subasta);

      }));
    });
  });
}());
