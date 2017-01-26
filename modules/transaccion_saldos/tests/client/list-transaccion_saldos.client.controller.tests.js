(function () {
  'use strict';

  describe('Transaccion_saldos List Controller Tests', function () {
    // Initialize global variables
    var Transaccion_saldosListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      Transaccion_saldosService,
      mockTransaccion_saldo;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _Transaccion_saldosService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      Transaccion_saldosService = _Transaccion_saldosService_;

      // create mock transaccion_saldo
      mockTransaccion_saldo = new Transaccion_saldosService({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Transaccion_saldo about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Transaccion_saldos List controller.
      Transaccion_saldosListController = $controller('Transaccion_saldosListController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockTransaccion_saldoList;

      beforeEach(function () {
        mockTransaccion_saldoList = [mockTransaccion_saldo, mockTransaccion_saldo];
      });

      it('should send a GET request and return all transaccion_saldos', inject(function (Transaccion_saldosService) {
        // Set POST response
        $httpBackend.expectGET('api/transaccion_saldos').respond(mockTransaccion_saldoList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.transaccion_saldos.length).toEqual(2);
        expect($scope.vm.transaccion_saldos[0]).toEqual(mockTransaccion_saldo);
        expect($scope.vm.transaccion_saldos[1]).toEqual(mockTransaccion_saldo);

      }));
    });
  });
}());
