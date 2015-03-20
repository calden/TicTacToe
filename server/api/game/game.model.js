'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/**
 * Schema Game
 *
 * stateGame = Over/Pending/Opened.
 */
var GameSchema = new Schema({
  player1: String,
  player2: String,
  stateBoard: { type: String, default: "_________" },
  stateGame: { type: String, default: "Opened" },
  winner: String,
  turnPlayer: { type: Number, default: 1 }
});

module.exports = mongoose.model('Game', GameSchema);



//db.games.aggregate([{$match:{"winner":{$exists:true}}},{$group:{"_id":"$winner", count:{$sum:1}}}])
