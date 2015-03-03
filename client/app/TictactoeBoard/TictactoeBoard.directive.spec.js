'use strict';

describe('Directive: TictactoeBoard', function () {

  // load the directive's module and view
  beforeEach(module('ticTacToeApp'));
  beforeEach(module('app/TictactoeBoard/TictactoeBoard.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<-tictactoe-board></-tictactoe-board>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the TictactoeBoard directive');
  }));
});