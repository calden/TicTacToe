'use strict';

describe('Game View', function() {
  var partieList;
  var newGame;

  beforeEach(function() {
    browser.get('http://localhost:9000')
  });

  it('should be able to create a new Game', function() {

      element(by.linkText('login')).then(console.log);//.click();
console.log(element(by.linkText('login')));
      element(by.model('user.email')).sendKeys('test@test.com');;

      element(by.model('user.password')).sendKeys('test');;
      browser.pause();
      element(by.buttonText('Login')).click();


      element.all(by.repeater("game in games")).then(console.log);
      var partieCount = element.all(by.repeater("game in games")).rows.length;

      element(by.buttonText('Créer partie')).click();
      element(by.buttonText("valider")).click();

      expect(element(by.id("confirmationMessage"))).toBePresent();
      expect(element.all(by.repeater("game in games")).rows.length).toBe(partieCount + 1);
  });
});
