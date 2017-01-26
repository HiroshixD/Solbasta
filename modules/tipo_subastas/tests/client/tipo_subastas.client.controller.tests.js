(function () {
  'use strict';

  describe('Tipo_subastas Controller Tests', function () {
    // Initialize global variables
    var Tipo_subastasController,
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

      // Initialize the Tipo_subastas controller.
      Tipo_subastasController = $controller('Tipo_subastasController as vm', {
        $scope: $scope,
        tipo_subastaResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleTipo_subastaPostData;

      beforeEach(function () {
        // Create a sample tipo_subasta object
        sampleTipo_subastaPostData = new Tipo_subastasService({
          title: 'An Tipo_subasta about MEAN',
          content: 'MEAN rocks!'
        });

        $scope.vm.tipo_subasta = sampleTipo_subastaPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Tipo_subastasService) {
        // Set POST response
        $httpBackend.expectPOST('api/tipo_subastas', sampleTipo_subastaPostData).respond(mockTipo_subasta);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the tipo_subasta was created
        expect($state.go).toHaveBeenCalledWith('tipo_subastas.view', {
          tipo_subastaId: mockTipo_subasta._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/tipo_subastas', sampleTipo_subastaPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock tipo_subasta in $scope
        $scope.vm.tipo_subasta = mockTipo_subasta;
      });

      it('should update a valid tipo_subasta', inject(function (Tipo_subastasService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/tipo_subastas\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('tipo_subastas.view', {
          tipo_subastaId: mockTipo_subasta._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (Tipo_subastasService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/tipo_subastas\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup tipo_subastas
        $scope.vm.tipo_subasta = mockTipo_subasta;
      });

      it('should delete the tipo_subasta and redirect to tipo_subastas', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/tipo_subastas\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('tipo_subastas.list');
      });

      it('should should not delete the tipo_subasta and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
