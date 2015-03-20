'use strict';

var _ = require('lodash');
var Game = require('./game.model');
var ruleServiceGame = require('./game.service');


/**
 * Fonction d'appel de la recherche avec un Id avec callback
 */
var findByIdWithCallBack = function (id, callback) {
  Game.findById(id, function (err, game) {
    callback(err, game);
  });
};

// Get list of games
exports.index = function(req, res) {
  Game.find(function (err, games) {
    if(err) { return handleError(res, err); }
    return res.json(200, games);
  });
};

// Validate and play turn
exports.validateAndPlayTurn = function(req, res) {
  var validateAndPlayTurnCallBack = function (err, game) {
    if(err) { return handleError(res, err); }
    if(!game) { return res.send(404); }
    else {
      ruleServiceGame.validateTurn(req,res,game);
      ruleServiceGame.playTurn(req,res,game);
    }
  };
  findByIdWithCallBack(req.params.id, validateAndPlayTurnCallBack);
};

// Get a single game
exports.show = function(req, res) {
  var callbackShow = function (err, game) {
    if(err) { return handleError(res, err); }
    if(!game) { return res.send(404); }
    return res.json(game);
  };
  findByIdWithCallBack(req.params.id,callbackShow);
};

// Creates a new game in the DB.
exports.create = function(req, res) {
  Game.create(req.body, function(err, game) {
    if(err) { return handleError(res, err); }
    Game.emit('game:create', game);
    return res.json(201, game);
  });
};

// Updates an existing game in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Game.findById(req.params.id, function (err, game) {
    if (err) { return handleError(res, err); }
    if(!game) { return res.send(404); }
    var updated = _.merge(game, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      Game.emit('game:save', game);
      return res.json(200, game);
    });
  });
};

// Deletes a game from the DB.
exports.destroy = function(req, res) {
  Game.findById(req.params.id, function (err, game) {
    if(err) { return handleError(res, err); }
    if(!game) { return res.send(404); }
    game.remove(function(err) {
      if(err) { return handleError(res, err); }
      Game.emit('game:remove', game);
      return res.send(204);
    });
  });
};

// Get scores list
exports.scores = function(req, res) {

  // TODO : Query for hight scores mongodb

  var scores = [
    { name: "Test",    score: 100 },
    { name: "Admin",   score: 75 },
    { name: "Player3", score: 50 },
    { name: "Player4", score: 40 },
    { name: "Player5", score: 30 },
    { name: "Player6", score: 20 },
    { name: "Player7", score: 10 },
    { name: "Player8", score: 9 },
    { name: "Player9", score: 8 },
    { name: "Player10",score: 7 }
  ];
  return res.json(200, scores);
};

function handleError(res, err) {
  return res.send(500, err);
}
