'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('ticTacToeApp'));
  beforeEach(module('socketMock'));

  var MainCtrl,
    scope,
    $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {

    $httpBackend = _$httpBackend_;

    $httpBackend.expectGET('/api/games')
      .respond([{
        name: 'Partie 1',
        info: 'X contre Y',
        active: true
      }, {
        name: 'Parie 2',
        info: 'X contre Z',
        active: false
      }]);

    scope = $rootScope.$new();

    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });

  }));

  it('should attach a list of things to the scope', function () {
    $httpBackend.flush();
    expect(scope.games.length).toBe(2);
  });

});
