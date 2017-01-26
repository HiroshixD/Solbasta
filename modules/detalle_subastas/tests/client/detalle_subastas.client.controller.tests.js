(function () {
  'use strict';

  describe('Detalle_subastas Controller Tests', function () {
    // Initialize global variables
    var Detalle_subastasController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      Detalle_subastasService,
      mockDetalle_subasta;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _Detalle_subastasService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      Detalle_subastasService = _Detalle_subastasService_;

      // create mock detalle_subasta
      mockDetalle_subasta = new Detalle_subastasService({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Detalle_subasta about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Detalle_subastas controller.
      Detalle_subastasController = $controller('Detalle_subastasController as vm', {
        $scope: $scope,
        detalle_subastaResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleDetalle_subastaPostData;

      beforeEach(function () {
        // Create a sample detalle_subasta object
        sampleDetalle_subastaPostData = new Detalle_subastasService({
          title: 'An Detalle_subasta about MEAN',
          content: 'MEAN rocks!'
        });

        $scope.vm.detalle_subasta = sampleDetalle_subastaPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Detalle_subastasService) {
        // Set POST response
        $httpBackend.expectPOST('api/detalle_subastas', sampleDetalle_subastaPostData).respond(mockDetalle_subasta);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the detalle_subasta was created
        expect($state.go).toHaveBeenCalledWith('detalle_subastas.view', {
          detalle_subastaId: mockDetalle_subasta._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/detalle_subastas', sampleDetalle_subastaPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock detalle_subasta in $scope
        $scope.vm.detalle_subasta = mockDetalle_subasta;
      });

      it('should update a valid detalle_subasta', inject(function (Detalle_subastasService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/detalle_subastas\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('detalle_subastas.view', {
          detalle_subastaId: mockDetalle_subasta._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (Detalle_subastasService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/detalle_subastas\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup detalle_subastas
        $scope.vm.detalle_subasta = mockDetalle_subasta;
      });

      it('should delete the detalle_subasta and redirect to detalle_subastas', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/detalle_subastas\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('detalle_subastas.list');
      });

      it('should should not delete the detalle_subasta and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
