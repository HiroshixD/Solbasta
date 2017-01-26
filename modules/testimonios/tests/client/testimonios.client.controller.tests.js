(function () {
  'use strict';

  describe('Testimonios Controller Tests', function () {
    // Initialize global variables
    var TestimoniosController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      TestimoniosService,
      mockTestimonio;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _TestimoniosService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      TestimoniosService = _TestimoniosService_;

      // create mock testimonio
      mockTestimonio = new TestimoniosService({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Testimonio about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Testimonios controller.
      TestimoniosController = $controller('TestimoniosController as vm', {
        $scope: $scope,
        testimonioResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleTestimonioPostData;

      beforeEach(function () {
        // Create a sample testimonio object
        sampleTestimonioPostData = new TestimoniosService({
          title: 'An Testimonio about MEAN',
          content: 'MEAN rocks!'
        });

        $scope.vm.testimonio = sampleTestimonioPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (TestimoniosService) {
        // Set POST response
        $httpBackend.expectPOST('api/testimonios', sampleTestimonioPostData).respond(mockTestimonio);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the testimonio was created
        expect($state.go).toHaveBeenCalledWith('testimonios.view', {
          testimonioId: mockTestimonio._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/testimonios', sampleTestimonioPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock testimonio in $scope
        $scope.vm.testimonio = mockTestimonio;
      });

      it('should update a valid testimonio', inject(function (TestimoniosService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/testimonios\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('testimonios.view', {
          testimonioId: mockTestimonio._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (TestimoniosService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/testimonios\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup testimonios
        $scope.vm.testimonio = mockTestimonio;
      });

      it('should delete the testimonio and redirect to testimonios', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/testimonios\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('testimonios.list');
      });

      it('should should not delete the testimonio and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
