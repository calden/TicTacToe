'use strict';

var landingPage = require('./landingPage.po');

var loginPage = function() {

  landingPage.goToLoginPage();

  this.emailField = element(by.model('user.email'));
  this.passwordField = element(by.model('user.password'));
  this.loginButton = element(by.buttonText('Login'));

  this.logAsTest = function(){
    this.emailField.sendKeys('test@test.com');
    this.passwordField.sendKeys('test');
    this.loginButton.click();
  };

  this.validationButton = element(by.buttonText("valider"));
  this.createNewGame = function(){
    this.validationButton.click();
  }
  this.confirmation = element(by.id("confirmationMessage"));
 };

module.exports = new loginPage();
