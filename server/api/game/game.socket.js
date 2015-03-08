/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Game = require('./game.model');

exports.register = function(socket) {
  Game.schema.post('save', function (doc) {
    socket.emit('game:save', doc);
  });
  Game.schema.post('remove', function (doc) {
    socket.emit('game:remove', doc);
  });
}
