'use strict'

var loginPage = require('./loginPage.po.js');

var PartiePage = function(){

  this.partieList = element(by.repeater("game in games"));
  this.partiesCount = this.partieList.rows.length;
}

module.export = new PartiePage();
