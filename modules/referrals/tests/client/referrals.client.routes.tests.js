(function () {
  'use strict';

  describe('Referrals Route Tests', function () {
    // Initialize global variables
    var $scope,
      ReferralsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ReferralsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ReferralsService = _ReferralsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('referrals');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/referrals');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('referrals.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have template', function () {
          expect(liststate.templateUrl).toBe('modules/referrals/client/views/list-referrals.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ReferralsController,
          mockReferral;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('referrals.view');
          $templateCache.put('modules/referrals/client/views/view-referral.client.view.html', '');

          // create mock referral
          mockReferral = new ReferralsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Referral about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          ReferralsController = $controller('ReferralsController as vm', {
            $scope: $scope,
            referralResolve: mockReferral
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:referralId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.referralResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            referralId: 1
          })).toEqual('/referrals/1');
        }));

        it('should attach an referral to the controller scope', function () {
          expect($scope.vm.referral._id).toBe(mockReferral._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/referrals/client/views/view-referral.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ReferralsController,
          mockReferral;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('referrals.create');
          $templateCache.put('modules/referrals/client/views/form-referral.client.view.html', '');

          // create mock referral
          mockReferral = new ReferralsService();

          // Initialize Controller
          ReferralsController = $controller('ReferralsController as vm', {
            $scope: $scope,
            referralResolve: mockReferral
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.referralResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/referrals/create');
        }));

        it('should attach an referral to the controller scope', function () {
          expect($scope.vm.referral._id).toBe(mockReferral._id);
          expect($scope.vm.referral._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/referrals/client/views/form-referral.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ReferralsController,
          mockReferral;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('referrals.edit');
          $templateCache.put('modules/referrals/client/views/form-referral.client.view.html', '');

          // create mock referral
          mockReferral = new ReferralsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Referral about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          ReferralsController = $controller('ReferralsController as vm', {
            $scope: $scope,
            referralResolve: mockReferral
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:referralId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.referralResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            referralId: 1
          })).toEqual('/referrals/1/edit');
        }));

        it('should attach an referral to the controller scope', function () {
          expect($scope.vm.referral._id).toBe(mockReferral._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/referrals/client/views/form-referral.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope) {
          $state.go('referrals.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('referrals/');
          $rootScope.$digest();

          expect($location.path()).toBe('/referrals');
          expect($state.current.templateUrl).toBe('modules/referrals/client/views/list-referrals.client.view.html');
        }));
      });

    });
  });
}());
