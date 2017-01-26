(function () {
  'use strict';

  describe('Contactos Controller Tests', function () {
    // Initialize global variables
    var ContactosController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      ContactosService,
      mockContacto;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _ContactosService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      ContactosService = _ContactosService_;

      // create mock contacto
      mockContacto = new ContactosService({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Contacto about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Contactos controller.
      ContactosController = $controller('ContactosController as vm', {
        $scope: $scope,
        contactoResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleContactoPostData;

      beforeEach(function () {
        // Create a sample contacto object
        sampleContactoPostData = new ContactosService({
          title: 'An Contacto about MEAN',
          content: 'MEAN rocks!'
        });

        $scope.vm.contacto = sampleContactoPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (ContactosService) {
        // Set POST response
        $httpBackend.expectPOST('api/contactos', sampleContactoPostData).respond(mockContacto);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the contacto was created
        expect($state.go).toHaveBeenCalledWith('contactos.view', {
          contactoId: mockContacto._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/contactos', sampleContactoPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock contacto in $scope
        $scope.vm.contacto = mockContacto;
      });

      it('should update a valid contacto', inject(function (ContactosService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/contactos\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('contactos.view', {
          contactoId: mockContacto._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (ContactosService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/contactos\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup contactos
        $scope.vm.contacto = mockContacto;
      });

      it('should delete the contacto and redirect to contactos', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/contactos\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('contactos.list');
      });

      it('should should not delete the contacto and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
