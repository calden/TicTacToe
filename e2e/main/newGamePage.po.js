'use strict';

var LandingPage = require('./landingPage.po');

var newGamePage = function() {
  LandingPage.goToNewGame();
  this.validationButton = element(by.buttonText("valider"));
  this.createNewGame = function(){
    this.validationButton.click();
  }
  this.confirmation = element(by.id("confirmationMessage"));
 };

module.exports = new newGamePage();
