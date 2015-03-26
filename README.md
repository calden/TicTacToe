

## Intro Yeoman
Utilisation d'une variante du code obtenu par le générateur Angular Fullstack disponible dans Yeoman.

cf slides pour
TODO

 * Yeoman et le concept de module  
 * Les modules Node et require
 * Express et le Router

## creation controller REST pour games
Création d'un nouveau module avec un répertoire `/server/api/game`

Créer un fichier `game.controller.js` qui sera le controller

```javascript
// handle the 500 reply in case of error.
function handleError(res, err) {
  return res.send(500, err);
}

//load the current game and call next middleware or return 404 if not found
export.loadGameById = function(req, res, next, id){
  if(id==='404') res.status(404).json({message:'no game for this id'});

  req.game = {'id' : id, name:'game loaded'};
  return next();
};

// Get list of games
exports.index = function (req, res) {
  var games = [
    {id:0, name:'foo'},
    {id:1, name:'bar'}
  ];
  return res.json(200, games);
};

// Get a single game
exports.show = function(req, res){
  return res.json(req.game);
};

// Creates a new game in the DB.
exports.create = function (req, res) {
  return res.json(201, {id:'new ID', name:'just created'});
};

// Updates an existing game in the DB.
exports.update = function (req, res) {
  req.game.name = "just updated";
  return res.json(200, req.game);
};

// Validate and play turn
exports.validateAndPlayTurn = function (req, res) {
  var position = parseInt(req.params.position);
  var userName = req.user.name;
  req.game.name = 'player '+ userName + 'just played ' + position;
  return res.json(200, req.game);
};

// Deletes a game from the DB.
exports.destroy = function (req, res) {
  if(!req.game) handleError(res, 'no passed by loadGameById');
  return res.send(204);
};

```

Il faut ensuite créer un fichier `index.js` qui sera chargé par défaut lors du chargement du module et permet de mapper les actions du controller sur les verbes HTTP et les URL :

```javascript
var express = require('express');
var controller = require('./game.controller');
var auth = require('../../auth/auth.service');
var router = express.Router();

router.param('id',controller.loadGameById);

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.post('/:id/:position', auth.isAuthenticated(), controller.validateAndPlayTurn);
router.delete('/:id', controller.destroy);

module.exports = router;
```
L'utilisation de auth permet de s'assurer que l'utilisateur est loggué et positionne ses informations dans la propriété `req.user`.

Il reste à indiquer à Express qu'il faut utiliser ces mapping pour les urls en `api/games/`. Dans le fichier `/server/routes.js` vous ajoutez :

```javascript
app.use('/api/games', require('./api/game'));
```
A noter que Express retire `/api/games/` de l'URL avant de passer le chemin au Router que vous avez déclaré.

Vous pouvez maintenant tester en utilisant CURL ou un client REST.

TODO exemple.


Comme on ne veux pas tester systématiquement à la main que les services REST sont fonctionnels, nous allons écrire des tests d'intégration. Pour cela nous utilisons `supertest`, une librairie proposant une sorte de DSL permettant d'écrire les tests.

Pour le test de la méthode GET renvoyant la liste des parties, nous obtenons le code suivant :

```javascript
'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');


describe('GET /api/games', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/games')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });
});
```

## model pour Games

Pour l'accès à la base de données, nous utilisons Mongoose qui permet de simplifier l'interaction avec MongoDB.

Mongoose permet de définir un mapping avec la fonction constructeur Schema que vous associerez à une collection dans MongoDB. Il est possible d'ajouter des fonctions pour des requêtes particulières dans le modèle ainsi obtenu.

Créez un fichier `/server/api/game/game.model.js`

```javascript
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

var Game = mongoose.model('Game', GameSchema);

module.exports = Game;
```

Vous allez commencer à utiliser ce modèle pour initialiser des données dans la base.

Dans le fichier `/server/app.js`, deux lignes permettent de faire la connexion à la base MongoDB et l'injection de quelques données (les utilisateurs).

```javascript
// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }
```
Les informations de connexion à la base sont dans le fichier `/server/config/environnement/index.js`(le config du require) qui renvoie un résultat sur la base d'un merge avec un fichier dépendant d'une variable d'environnement :
```javascript
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});
```

Le fichier d'initialisation de la base est `/server/config/seed.js` et contient déjà du code pour supprimer les users existants et en créer de nouveau.

On modifie ce fichier pour permettre la création de quelques jeux :
```javascript
var Game = require('../api/game/game.model');

Game.find({}).remove(function() {
  Game.create({
  	player1 : "Test",
  	player2 : "Admin",
  	turnPlayer : 1,
  	stateGame : "Over",
  	stateBoard : "X_XOOOX__",
  	winner : "Admin"
  },{
  	player1 : "Test",
  	player2 : "Admin",
  	turnPlayer : 1,
  	stateGame : "Over",
  	stateBoard : "XX_OOOX__",
  	winner : "Admin"
  },{
  	player1 : "Test",
  	player2 : "Admin",
  	turnPlayer : 1,
  	stateGame : "Over",
  	stateBoard : "XXXOO____",
  	winner : "Test"
  },{
    player1: "Test",
    player2: "Admin",
    stateGame: "Pending",
    turnPlayer: 1
  }, {
    player1: "Test",
    stateGame: "Opened"
  }, function() {
      console.log('finished populating games');
    }
  );
});
```
On peut ensuite modifier le code du controller pour remplacer nos méthodes bouchonnées par des vrais appels à MongoDB.

Les méthodes des modèles sont asynchrones et prennent en paramètres des callback qui recevront en argument une erreur en premier paramètre et le résultat de la requête en second paramètre.

```javascript
// Get list of games
exports.index = function (req, res) {
  Game.find(function (err, games) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, games);
  });
};
```
Vous pouvez alors retester votre service et vérifié que vous recevez bien la liste des parties que vous avez initialisé dans le fichier `/server/config/seed.js`

TODO remettre la requête

Vous pouvez alors faire la suite des modifications :

```javascript
//load the current game and call next middleware or return 404 if not found
exports.loadGameById = function (req, res, next, id) {
  var query = Game.findById(id);

  query.exec(function (err, game) {
    if (err) {
      return handleError(res, err);
    }
    if (!game) {
      return res.status(404).json('no game for this id');
    }
    req.game = game;
    return next();
  });
};

// ....

// Get a single game
exports.show = function (req, res) {
  return res.json(req.game);
};

// Creates a new game in the DB.
exports.create = function (req, res) {
  Game.create(req.body, function (err, game) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(201, game);
  });
};

// Updates an existing game in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  var updated = _.merge(req.game, req.body);
  updated.save(function (err, game) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, game);
  });
};

// Deletes a game from the DB.
exports.destroy = function (req, res) {
  req.game.remove(function (err) {
    if (err) {
      return handleError(res, err);
    }
    return res.send(204);
  });
};
```

Il est alors possible de refaire des tests pour vérifier que l'on écrit bien dans la base MongoDB.

## affichage parties en cours
## creation d'une partie dans le back

Nous allons maintenant voir comment nous pouvons créer une partie dans le backend. L'objet Game etant créer dans le front, nous n'avons rien de plus à faire que ce qui a été fait dans le step de création du model pour Game, qui récupère l'objet Game dans le body de la requete pour le persister.

## creation partie front
## Socket back et front

Afin de pouvoir communiquer entre les différents clients, nous allons utiliser des sockets. Elles permettront de pousser vers les clients les créations / fin de parties ainsi que les coups joués par les joueurs.

Le template fourni une gestion de websockets.

Dans le fichier `/server/app.js` il y a une ligne :
```javascript
require('./config/socketio')(socketio);
```
dans ce fichier `/sever/config/socketio.js` dans la fonction `onConnect` vous ajoutez
```javascript
// Insert sockets below
require('../api/game/game.socket').register(socket);
```
Pour permettre de séparer les reponsabilité, nous allons utiliser le système d'événements de NodeJS.
Les Objet Model ont EventEmitter dans leur chaîne prototypal. Cela leur permet d'émettre des événements.

Dans le code du controller, `/server/api/game/game.controller.js` nous ajoutons l'émission d'événement sur les actions.

```javascript
// Creates a new game in the DB.
exports.create = function (req, res) {
  Game.create(req.body, function (err, game) {
    if (err) {
      return handleError(res, err);
    }
    Game.emit('game:create', game);
    return res.json(201, game);
  });
};

// Updates an existing game in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  var updated = _.merge(req.game, req.body);
  updated.save(function (err, game) {
    if (err) {
      return handleError(res, err);
    }
    Game.emit('game:save', game);
    return res.json(200, game);
  });
};

// Deletes a game from the DB.
exports.destroy = function (req, res) {
  req.game.remove(function (err) {
    if (err) {
      return handleError(res, err);
    }
    Game.emit('game:remove', req.game);
    return res.send(204);
  });
};
```

Ensuite vous créez le fichier `/server/api/game/game.socket.js`.

Vous pouvez ajouter le code suivant dedans :

```javascript
var Game = require('./game.model');

exports.register = function(socket) {
  Game.on('game:save', function (doc) {
    socket.emit('game:save', doc);
  });
  Game.on('game:remove', function (doc) {
    socket.emit('game:remove', doc);
  });
  Game.on('game:create', function (doc) {
    socket.emit('game:create', doc);
  });
};
```
A partir de ce moment, un message est envoyé sur la socket lorsque nous émettons un event.

A noter que nous aurions pu utiliser des Middleware sur le Schema qui propose des "hook" sur les post save et remove mais ceux-ci n'auraient pas permis de faire la différence entre un update et une création.

## joue un coup back
## plug directive game sur front
## Protractor
## OAuth
## Top10
