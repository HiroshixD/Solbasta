(function () {
  'use strict';

  describe('Datos_envios Controller Tests', function () {
    // Initialize global variables
    var Datos_enviosController,
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

      // Initialize the Datos_envios controller.
      Datos_enviosController = $controller('Datos_enviosController as vm', {
        $scope: $scope,
        datos_envioResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleDatos_envioPostData;

      beforeEach(function () {
        // Create a sample datos_envio object
        sampleDatos_envioPostData = new Datos_enviosService({
          title: 'An Datos_envio about MEAN',
          content: 'MEAN rocks!'
        });

        $scope.vm.datos_envio = sampleDatos_envioPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Datos_enviosService) {
        // Set POST response
        $httpBackend.expectPOST('api/datos_envios', sampleDatos_envioPostData).respond(mockDatos_envio);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the datos_envio was created
        expect($state.go).toHaveBeenCalledWith('datos_envios.view', {
          datos_envioId: mockDatos_envio._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/datos_envios', sampleDatos_envioPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock datos_envio in $scope
        $scope.vm.datos_envio = mockDatos_envio;
      });

      it('should update a valid datos_envio', inject(function (Datos_enviosService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/datos_envios\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('datos_envios.view', {
          datos_envioId: mockDatos_envio._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (Datos_enviosService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/datos_envios\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup datos_envios
        $scope.vm.datos_envio = mockDatos_envio;
      });

      it('should delete the datos_envio and redirect to datos_envios', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/datos_envios\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('datos_envios.list');
      });

      it('should should not delete the datos_envio and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
