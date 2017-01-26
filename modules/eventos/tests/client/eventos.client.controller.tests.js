(function () {
  'use strict';

  describe('Eventos Controller Tests', function () {
    // Initialize global variables
    var EventosController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      EventosService,
      mockEvento;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _EventosService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      EventosService = _EventosService_;

      // create mock evento
      mockEvento = new EventosService({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Evento about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Eventos controller.
      EventosController = $controller('EventosController as vm', {
        $scope: $scope,
        eventoResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleEventoPostData;

      beforeEach(function () {
        // Create a sample evento object
        sampleEventoPostData = new EventosService({
          title: 'An Evento about MEAN',
          content: 'MEAN rocks!'
        });

        $scope.vm.evento = sampleEventoPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (EventosService) {
        // Set POST response
        $httpBackend.expectPOST('api/eventos', sampleEventoPostData).respond(mockEvento);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the evento was created
        expect($state.go).toHaveBeenCalledWith('eventos.view', {
          eventoId: mockEvento._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/eventos', sampleEventoPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock evento in $scope
        $scope.vm.evento = mockEvento;
      });

      it('should update a valid evento', inject(function (EventosService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/eventos\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('eventos.view', {
          eventoId: mockEvento._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (EventosService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/eventos\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup eventos
        $scope.vm.evento = mockEvento;
      });

      it('should delete the evento and redirect to eventos', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/eventos\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('eventos.list');
      });

      it('should should not delete the evento and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
