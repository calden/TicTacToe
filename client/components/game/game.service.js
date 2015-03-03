'use strict';

angular.module('ticTacToeApp')
  .factory('Game', function ($resource) {
    return $resource('/api/games/:id', {
      id: '@_id'
    },
    {
      update: {
        method: 'PUT'
      },
      get: {
        method: 'GET'
      },
      getAll: {
        method:'GET',
       isArray:true
       },
	  });
  });
