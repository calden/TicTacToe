'use strict';

xdescribe('Game View', function() {
  var partieList;
  var newGame;

  beforeEach(function() {
    newGame = require('./newGamePage.po');
    partieList = require('./partiePage.po');
  });

  it('should be able to create a new Game', function() {
      console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
      partieList.partieList.then(console.log);
      var partieCount = partieList.partiesCount;
      newGame.createNewGame();
      expect(newGame.confirmation).toBePresent();
      expect(partieList.partiesCount).toBe(partieCount + 1);
  });
});
