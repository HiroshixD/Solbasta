(function () {
  'use strict';

  describe('Transaccion_cuentas List Controller Tests', function () {
    // Initialize global variables
    var Transaccion_cuentasListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      Transaccion_cuentasService,
      mockTransaccion_cuenta;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _Transaccion_cuentasService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      Transaccion_cuentasService = _Transaccion_cuentasService_;

      // create mock transaccion_cuenta
      mockTransaccion_cuenta = new Transaccion_cuentasService({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Transaccion_cuenta about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Transaccion_cuentas List controller.
      Transaccion_cuentasListController = $controller('Transaccion_cuentasListController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockTransaccion_cuentaList;

      beforeEach(function () {
        mockTransaccion_cuentaList = [mockTransaccion_cuenta, mockTransaccion_cuenta];
      });

      it('should send a GET request and return all transaccion_cuentas', inject(function (Transaccion_cuentasService) {
        // Set POST response
        $httpBackend.expectGET('api/transaccion_cuentas').respond(mockTransaccion_cuentaList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.transaccion_cuentas.length).toEqual(2);
        expect($scope.vm.transaccion_cuentas[0]).toEqual(mockTransaccion_cuenta);
        expect($scope.vm.transaccion_cuentas[1]).toEqual(mockTransaccion_cuenta);

      }));
    });
  });
}());
