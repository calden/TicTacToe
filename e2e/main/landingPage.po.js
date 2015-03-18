'use strict';

var landingPage = function() {
  browser.get('http://localhost:9000')
  this.loginLink = element.(by.linkText('Login'));
  this.goToLoginPage = function(){
    this.loginLink.click();
  }
  this.newGameButton = element(by.buttonText('Créer partie'));
  this.goToNewGame = function(){
    this.newGameButton.click();
  }

};

module.exports = new landingPage();
