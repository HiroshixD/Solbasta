(function () {
  'use strict';

  describe('Ubigeos Controller Tests', function () {
    // Initialize global variables
    var UbigeosController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      UbigeosService,
      mockUbigeo;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _UbigeosService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      UbigeosService = _UbigeosService_;

      // create mock ubigeo
      mockUbigeo = new UbigeosService({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Ubigeo about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Ubigeos controller.
      UbigeosController = $controller('UbigeosController as vm', {
        $scope: $scope,
        ubigeoResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleUbigeoPostData;

      beforeEach(function () {
        // Create a sample ubigeo object
        sampleUbigeoPostData = new UbigeosService({
          title: 'An Ubigeo about MEAN',
          content: 'MEAN rocks!'
        });

        $scope.vm.ubigeo = sampleUbigeoPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (UbigeosService) {
        // Set POST response
        $httpBackend.expectPOST('api/ubigeos', sampleUbigeoPostData).respond(mockUbigeo);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the ubigeo was created
        expect($state.go).toHaveBeenCalledWith('ubigeos.view', {
          ubigeoId: mockUbigeo._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/ubigeos', sampleUbigeoPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock ubigeo in $scope
        $scope.vm.ubigeo = mockUbigeo;
      });

      it('should update a valid ubigeo', inject(function (UbigeosService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/ubigeos\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('ubigeos.view', {
          ubigeoId: mockUbigeo._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (UbigeosService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/ubigeos\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup ubigeos
        $scope.vm.ubigeo = mockUbigeo;
      });

      it('should delete the ubigeo and redirect to ubigeos', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/ubigeos\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('ubigeos.list');
      });

      it('should should not delete the ubigeo and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
