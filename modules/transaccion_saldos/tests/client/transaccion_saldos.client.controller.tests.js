(function () {
  'use strict';

  describe('Transaccion_saldos Controller Tests', function () {
    // Initialize global variables
    var Transaccion_saldosController,
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

      // Initialize the Transaccion_saldos controller.
      Transaccion_saldosController = $controller('Transaccion_saldosController as vm', {
        $scope: $scope,
        transaccion_saldoResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleTransaccion_saldoPostData;

      beforeEach(function () {
        // Create a sample transaccion_saldo object
        sampleTransaccion_saldoPostData = new Transaccion_saldosService({
          title: 'An Transaccion_saldo about MEAN',
          content: 'MEAN rocks!'
        });

        $scope.vm.transaccion_saldo = sampleTransaccion_saldoPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Transaccion_saldosService) {
        // Set POST response
        $httpBackend.expectPOST('api/transaccion_saldos', sampleTransaccion_saldoPostData).respond(mockTransaccion_saldo);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the transaccion_saldo was created
        expect($state.go).toHaveBeenCalledWith('transaccion_saldos.view', {
          transaccion_saldoId: mockTransaccion_saldo._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/transaccion_saldos', sampleTransaccion_saldoPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock transaccion_saldo in $scope
        $scope.vm.transaccion_saldo = mockTransaccion_saldo;
      });

      it('should update a valid transaccion_saldo', inject(function (Transaccion_saldosService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/transaccion_saldos\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('transaccion_saldos.view', {
          transaccion_saldoId: mockTransaccion_saldo._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (Transaccion_saldosService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/transaccion_saldos\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup transaccion_saldos
        $scope.vm.transaccion_saldo = mockTransaccion_saldo;
      });

      it('should delete the transaccion_saldo and redirect to transaccion_saldos', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/transaccion_saldos\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('transaccion_saldos.list');
      });

      it('should should not delete the transaccion_saldo and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
