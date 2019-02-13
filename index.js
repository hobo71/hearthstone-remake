var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 8000;
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});


app.use(express.static(path.join(__dirname, 'public')));
const fs = require('fs');
const request = require('request') 

function saveCardImage(id){
  if (!fs.existsSync("public/cardImage/"+id+".jpg")) { 
	  request.head("https://art.hearthstonejson.com/v1/512x/"+id+".jpg", function(err, res, body){
	    request("https://art.hearthstonejson.com/v1/512x/"+id+".jpg").pipe(fs.createWriteStream("public/cardImage/"+id+".jpg"));
	  });
	}
	else {
		console.log("already exist.")
	}
};

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}
function shuffle(arr) {
	for (var i =  arr.length-1; i > 0; i--) {
		var index = getRandomIntInclusive(0, arr.length-1);
		
		var c = arr[i];
		arr[i] = arr[index]
		arr[index] = c;
	}
	return arr
}
//var deckstring = require("deckstrings")
//const decoded = deckstring.decode(process.argv[2]);
// console.log(decoded)


var _ = require('lodash');
// Load the core build.
var _ = require('lodash/core');
// Load the FP build for immutable auto-curried iteratee-first data-last methods.
var fp = require('lodash/fp');
 
// Load method categories.
var array = require('lodash/array');
var object = require('lodash/fp/object');
 
// Cherry-pick methods for smaller browserify/rollup/webpack bundles.
var at = require('lodash/at');
var curryN = require('lodash/fp/curryN');

 

var contents = fs.readFileSync("public/cards.json");
var jsonContent = JSON.parse(contents);

function getIndexByDbfId(dbfId){
	for (var i = 0; i < jsonContent.length; i++) {
		if (jsonContent[i].dbfId === dbfId)
			return i
	}
}
 
var clients = [];
var rooms = [];
class Card{

	constructor(place){
		this.place = place;
 
	}
}
class Client{
	constructor(id){
		this.id = id;
		this.enemyClient = undefined;
		this.inGame = false;
		this.gameNbr = undefined;
		this.game =  {
			deck: [],
			hand: [],
			board: [],
			enemyBoard: [],
			heroStats: {
				heroName:"Druid",
				hp:30,
				armor:0
			}
		}


 	// 	for (var j = 0; j < 30; j++) { 

		// 	var index = getRandomIntInclusive(0, 5000); 
 	// 		while (jsonContent[index].type != "MINION") {
 	// 			 index = getRandomIntInclusive(0, 5000); 
 	// 		}  
 	// 		var charge = false;
 	// 		try{  
 	// 		if (jsonContent[index].mechanics.includes("CHARGES"))
 	// 			charge = true;
 	// 		} catch (e){

 	// 		}
		// 	this.game.deck.push(new Card("deck", jsonContent[index].cost, jsonContent[index].name, "Common", "minion",jsonContent[index].attack, jsonContent[index].health, true, jsonContent[index].id, jsonContent[index].text));
		// }
 
	}
	reset(){
		this.enemyClient = undefined;
		this.inGame = false;
		this.gameNbr = undefined
		this.game =  {
			deck: [],
			hand: [],
			board: [],
			enemyBoard: [],
			heroStats: {
				heroName:"Druid",
				hp:30,
				armor:0,
				manaMax : 0,
				mana : 0
			}
		}
		// for (var i = 0; i < decoded.cards.length; i++) {
		// 	var index =  getIndexByDbfId( decoded.cards[i][0] );
		// 	var c = new Card("deck");
		// 	c.stats =  JSON.parse( JSON.stringify (jsonContent[index] ) )   // hire me microsoft

		// 	if (c.stats.type === "MINION") {  
		// 		if (c.stats.mechanics != undefined) 
		// 		c.stats.canAttack = c.stats.mechanics.includes("CHARGE")
		// 		c.stats.maxHealth =  c.stats.health
		// 		c.stats.maxAttack = c.stats.attack 
		// 	}


		// 	// Object.keys(c.stats).forEach(function(stat) {
		// 	//   if (c.stats[stat] === undefined)
		// 	//   	c.stats[stat] = null;
		// 	//   // console.log(stat, c.stats[stat]);
		// 	// });			 			

		// 	this.game.deck.push(c);
 	// 		saveCardImage(jsonContent[index].id);
		// }
 



 		for (var j = 0; j < 30; j++) { 
			var index = getRandomIntInclusive(0, 5000); 
 			while (jsonContent[index].type != "MINION"|| jsonContent[index].set != "CORE" ) {
 				 index = getRandomIntInclusive(0, 5000); 
			 }  
			 this.addCard(index)
		} 
		
 

		this.game.deck = shuffle(this.game.deck)


		// this.addCard( getIndexByDbfId(389))
		// this.addCard( getIndexByDbfId(132))

		// var c = new Card("deck");
		// c.stats =  JSON.parse( JSON.stringify (jsonContent[getIndexByDbfId(389)] ) )    
		// this.game.deck.push(c);

		for (var i = 0; i < 4; i++) {
			this.draw();
		} 
	}

	addCard(index){
		var c = new Card("deck");
		c.stats =  JSON.parse( JSON.stringify (jsonContent[index] ) )   // hire me microsoft
		if (c.stats.type === "MINION") { 			
			if (c.stats.mechanics != undefined) {  
				c.stats.canAttack = c.stats.mechanics.includes("CHARGE")
			}
			
			// si c'est pas un minion ça va envoyer un undefined, il faut faire une verif ici dans le futur.
			c.stats.maxHealth = c.stats.health
			c.stats.maxAttack = c.stats.attack 
			
			c.stats.standardMaxHealth = c.stats.health
			c.stats.standardMaxAttack = c.stats.attack 
			
			console.log(c.stats.dbfId)
			c.stats.hasToSelect = [389, 132, 608, 339, 413, 189].includes(c.stats.dbfId)

		}
		saveCardImage(jsonContent[index].id);
		this.game.deck.push(c);
	}
	draw() {
		try {  
			this.game.deck[this.game.deck.length-1].place = "hand";
			this.game.hand.push(this.game.deck[this.game.deck.length-1])
			this.game.deck.pop();
		  	this.sync();
		} catch (e) {
			console.log("cant draw");
		}
	}
	sync(){
	  	io.to(this.id).emit('syncHand', this.game.hand);
	  	io.to(this.id).emit('syncBoard', this.game.board);
	  	io.to(this.id).emit("syncHero", this.game.heroStats)

/*
		var enemyBoard_forEnemy = this.game.board.slice(0) // tout est relatif 
		for (var j = 0; j < enemyBoard_forEnemy.length; j++) {
			enemyBoard_forEnemy[j].place = "enemyBoard";
		}
*/
		
	  	io.to(this.enemyClient.id).emit('syncEnemyHand', this.game.hand.length);
	  	io.to(this.enemyClient.id).emit('syncEnemyBoard', this.game.board);
		io.to(this.enemyClient.id).emit('syncEnemyHero', this.game.heroStats);
	}

	boardHasTaunt(){
		for (var i = 0; i < this.game.board.length; i++) {
			if (this.game.board[i].stats.mechanics != undefined && this.game.board[i].stats.mechanics.includes("TAUNT"))
				return true
		}
		return false
	}
 
	healEntity(index, give, hp, entityType) {
		// !give => health+=hp if health < maxHealth || give => maxHealth+=hp && health+=hp 
		if (entityType === "enemyMinion") {
			if (give) {  
				this.enemyClient.game.board[index].stats.maxHealth += hp;
				this.enemyClient.game.board[index].stats.health += hp;
			} else {
				while (this.enemyClient.game.board[index].stats.health + hp > this.enemyClient.game.board[index].stats.maxHealth){
					hp--;
				}
				this.enemyClient.game.board[index].stats.health += hp;
			}


		} else if (entityType === "friendlyMinion") {
			if (give) {  
				this.game.board[index].stats.maxHealth += hp;
				this.game.board[index].stats.health += hp;
			} else {
				while (this.game.board[index].stats.health + hp > this.game.board[index].stats.maxHealth){
					hp--;
				}
				this.game.board[index].stats.health += hp;
			}
		} else if (entityType === "enemyHero") {
			while (this.enemyClient.game.heroStats.hp + hp > 30){
				hp--;
			}
			this.enemyClient.game.heroStats.hp +=  hp
			this.sync();
			this.enemyClient.sync();
		} else if (entityType === "hero") {
			while (this.game.heroStats.hp + hp > 30){
				hp--;
			}
			this.game.heroStats.hp +=  hp
			this.sync();
			this.enemyClient.sync();
		}


	}

	giveAttack(index, attack, entityType){
		if (entityType === "enemyMinion"){
			this.enemyClient.game.board[index].stats.attack += 1;
		}
		else if (entityType === "friendlyMinion") {
			this.game.board[index].stats.attack += 1;
		}
		this.sync();
		this.enemyClient.sync();
	}
	/*
	damageHero(hpLost){
		this.game.heroStats.hp -=  hpLost
		this.sync();
		this.enemyClient.sync();
	}
	damageFriendlyMinion(index, damage){
		this.game.board[index].stats.health -= damage;
		if (this.game.board[index].stats.health <= 0){ 
			this.game.board.splice(index, 1)
		}	
	}
	damageEnemyMinion(index, damage){
		this.enemyClient.game.board[index].stats.health -= damage;
		if (this.enemyClient.game.board[index].stats.health <= 0){ 
			this.enemyClient.game.board.splice(index, 1)
		}
	}
	damageEnemyHero(hpLost) {
		this.enemyClient.game.heroStats.hp -=  hpLost
		this.sync();
		this.enemyClient.sync();
	}
	*/

	damage(index, damage, entityType) {
		
		if (entityType === "enemyMinion") {
			this.enemyClient.game.board[index].stats.health -= damage;
			if (this.enemyClient.game.board[index].stats.health <= 0){ 
				this.enemyClient.game.board.splice(index, 1)
			}
		} else if (entityType === "friendlyMinion") {
			this.game.board[index].stats.health -= damage;
			if (this.game.board[index].stats.health <= 0){ 
				this.game.board.splice(index, 1)
			}	
		} else if (entityType === "enemyHero") {
			this.enemyClient.game.heroStats.hp -=  damage
			this.sync();
			this.enemyClient.sync();
		} else if (entityType === "hero") {
			this.game.heroStats.hp -=  damage
			this.sync();
			this.enemyClient.sync();
		}
	}


	summonMinion(dbfId) {
		if (this.game.board.length === 7) return
		var c = new Card("board")
		c.stats =  JSON.parse( JSON.stringify (jsonContent[getIndexByDbfId( dbfId )] ) )   // hire me microsoft

		// c.stats = jsonContent[getIndexByDbfId( dbfId )];
		c.stats.maxHealth = c.stats.health
		c.stats.maxAttack = c.stats.attack 
		
		c.stats.standardMaxHealth = c.stats.health
		c.stats.standardMaxAttack = c.stats.attack 
		
		this.game.board.push(c)
		this.sync();
		this.enemyClient.sync();
	}

	battlecry(dbfId, selected_entityType, indexMinion){

		// if (indexMinion > -1) {
		// 	if (selected_entityType === "enemyMinion"){
		// 		this.damageEnemyMinion(indexMinion, 1);
		// 	} else if (selected_entityType === "friendlyMinion") {
		// 		this.damageFriendlyMinion(indexMinion), 1;
		// 	}
		// }
		// if (selected_entityType === "enemyHero") {
		// 	this.damageEnemyHero(1)
		// }
		// else if (selected_entityType === "hero") {
		// 	this.damageHero(1)
		// }

		 
		switch(dbfId) {
			  case 389:
				// 	if (indexMinion > -1) {  
				// 		if (selected_entityType === "enemyMinion"){
				// 			this.damage(indexMinion, 1, "enemyMinion")
				// 		} else if (selected_entityType === "friendlyMinion") {
				// 			this.damage(indexMinion, 1, "friendlyMinion")
				// 		}
				// 	}
				// 	else if (selected_entityType === "hero") {
				// 		this.damage(-1, 1, "hero")
				// 	} else if (selected_entityType === "enemyHero") {
				// 		this.damage(-1, 1, "enemyHero")
					
				// }
				this.damage(indexMinion, 1, selected_entityType)

				break;
			case 1019:
				console.log(dbfId)
				for (var i = this.game.board.length - 1; i >= 0; i--){        
				// for (var i = 0; i < this.game.board.length; i++) {
					this.damage(i, 1, "friendlyMinion")
				}
				for (var i = this.enemyClient.game.board.length - 1; i >= 0; i--){        
					this.damage(i, 1, "enemyMinion")
				}
				this.damage(-1, 1, "enemyHero");
				this.damage(-1, 1, "hero");
				break;
			  case 670:
			  	this.damage(-1, 3, "enemyHero"); // nightblade 
			    break;
			  case 976:  // Murloc Tidehunter
			  	this.summonMinion(1078); 
			  	break
			  case 523: // Dragonling Mechanic
			  	this.summonMinion(59);
				  break
			  case 339: //Ironforge Rifleman
				this.damage(indexMinion, 1, selected_entityType)
				break;
			case 608: // Shattered Sun Cleric
				this.giveAttack(indexMinion, 1, selected_entityType)
				this.healEntity(indexMinion, true, 1, selected_entityType)
				break
			  case 413: // Stormpike Commando
				this.damage(indexMinion, 2, selected_entityType)
				break;
			  case 257: // Razorfen Hunter
			  	this.summonMinion(298)
			  	break
			  case 284:
			  	this.draw();
			  	break;
			  case 308:
			  	this.draw();
				break;
			  case 41: // Frostwolf Grunt on doit tout changer pour cette carte
				break;				
			case 1068: // Guardian of Kings
				this.healEntity(-1, false, 6, "hero")
				break
			case 189: // Fire Elemental
				this.damage(indexMinion, 3, selected_entityType)
				break;

			  case 132: // Voodoo Doctor
				this.healEntity(indexMinion, false, 2, selected_entityType)
				break
			  default:
			  	return;
			}
 
	}
}
class Room{
	constructor(client1, client2, gameNbr){
		this.clients = [client1, client2];
		this.gameNbr = gameNbr;

		this.clients[0].turn = true;
		this.clients[1].turn = false;
		this.clients[0].summonMinion(1733)
		this.newTurn()
	}
	newTurn(){
		this.clients[0].turn = !this.clients[0].turn;  
	  	this.clients[1].turn = !this.clients[1].turn;  
	  	for (var i = 0; i < this.clients.length; i++) {
			if (this.clients[i].turn) {
				this.clients[i].draw();
				for (var j = 0; j < this.clients[i].game.board.length; j++) {
					this.clients[i].game.board[j].stats.canAttack = true;
				}
				for (var j = 0; j < this.clients[i].enemyClient.game.board.length; j++) {
					this.clients[i].enemyClient.game.board[j].stats.canAttack = false;
				}
				if (this.clients[i].game.heroStats.manaMax < 10) {  
					this.clients[i].game.heroStats.manaMax++;
				}
				this.clients[i].game.heroStats.mana = this.clients[i].game.heroStats.manaMax; 
			}    
		  	io.to(this.clients[i].id).emit('newTurn', this.clients[i].turn);
	  	}

	  	for (var i = 0; i < this.clients.length; i++) {
	  		this.clients[i].sync();
	  	}
	  	// setTimeout(()=>{
	  	// 	this.newTurn();
	  	// }, 30000)

	}


 
}
function clientIndexById(id){
  for (var i = 0; i < clients.length; i++) {
  	if (clients[i].id === id) {
  		return i;
  	}
  }
}
function newGame(client){
	client.reset();

	for (var i = 0; i < clients.length; i++) {
		if (clients[i].id != client.id && !clients[i].inGame){
			clients[i].reset();

			client.inGame = true;
			clients[i].inGame = true;

			client.enemyClient = clients[i];
			clients[i].enemyClient    = client;
			
			client.gameNbr = gameNbr
			clients[i].gameNbr    = gameNbr


		  	io.to(client.id).emit('setRoom', String(gameNbr));
		  	io.to(clients[i].id      ).emit('setRoom', String(gameNbr));

			var room = new Room(client, clients[i], gameNbr);
			rooms.push(room)
			gameNbr++;

		}
	}
}
var gameNbr = 0;
io.on('connection', (socket) =>{
	// console.log(socket.request.headers.referer)
 	var currentClient = new Client(socket.id); 
 	clients.push(currentClient);
 	newGame(currentClient)
	socket.on("setRoom", (gameNbr) => {
	  socket.join(gameNbr);
	})
	socket.on("disconnect", () => {
		for (var i = 0; i < rooms.length; i++) {
			if (rooms[i].gameNbr === currentClient.gameNbr) { 
				rooms.splice(i, 1)
				 break;
			}
		}
	  socket.leave(currentClient.gameNbr);

	  clients.splice(clientIndexById(currentClient.id), 1);

	  if (currentClient.enemyClient != undefined)
	  io.to(currentClient.enemyClient.id).emit('enemyDisconnected');

	})
	socket.on("enemyDisconnected", ()=>{
  		newGame(currentClient)
	})
	socket.on("changeTurn", ()=>{
		if (!currentClient.turn) return 

 		for (var i = 0; i < rooms.length; i++) {
 			if (rooms[i].clients[0].id === socket.id || rooms[i].clients[1].id === socket.id) {
 				rooms[i].newTurn();
 			}
 		}
			
	})
	socket.on("cardPlaced", (card)=>{
		console.log(currentClient.game.board.length)
		if (card.stat.type === "MINION" && currentClient.game.board.length === 7) return
		
		for (var i = 0; i < currentClient.game.hand.length; i++) {
			// console.log("---")
			// console.log(currentClient.game.hand[i].stats)
			// console.log(card.stat)
			if (currentClient.turn && _.isEqual(card.stat, currentClient.game.hand[i].stats)) {
				if (currentClient.game.heroStats.mana >= currentClient.game.hand[i].stats.cost) {  
					
					var indexMinion = -1;
					if (card.selected_entityType === "enemyMinion") {
						for (var j = 0; j < currentClient.enemyClient.game.board.length; j++) {
							if (_.isEqual(currentClient.enemyClient.game.board[j].stats, card.selected_entity_stat)) {
								indexMinion = j

							}
						}
					}
					
					if (card.selected_entityType === "friendlyMinion") {
						for (var j = 0; j < currentClient.game.board.length; j++) {
							if (_.isEqual(currentClient.game.board[j].stats, card.selected_entity_stat)) {
								indexMinion = j;

							}
						}
					}
					// else if (card.selected_entityType === "enemyHero") {
					// 	if (_.isEqual(currentClient.enemyClient.game.heroStats, card.selected_entity_stat)) {
							
					// 	}
					// }
					
					// else if (card.selected_entityType === "hero") {
					// 	if (_.isEqual(currentClient.game.heroStats, card.selected_entity_stat)) {
					// 	}
					// }
					currentClient.game.heroStats.mana -= currentClient.game.hand[i].stats.cost;
					currentClient.battlecry(currentClient.game.hand[i].stats.dbfId, card.selected_entityType, indexMinion);

					if (currentClient.game.hand[i].stats.type === "MINION") {  // or maybe weapon.				
						currentClient.game.board.push(currentClient.game.hand[i]);
						currentClient.game.hand[i].place = "board";
					}                                                                     
 
					currentClient.game.hand.splice(i, 1);
					currentClient.sync(); 
					currentClient.enemyClient.sync(); 
				}
				return
			}
		}
	})
	socket.on("tradeMinion", (traded_minions) => {
		if (!currentClient.turn ||
			 currentClient.enemyClient.boardHasTaunt() && traded_minions.enemyMinion.mechanics  != undefined && !traded_minions.enemyMinion.mechanics.includes("TAUNT") ||
			 currentClient.enemyClient.boardHasTaunt() && traded_minions.enemyMinion.mechanics === undefined){ 
				 return
		}

		console.log(currentClient.turn);
		console.log(currentClient.enemyClient.boardHasTaunt())
		console.log(traded_minions.enemyMinion.mechanics)
		console.log(traded_minions.enemyMinion.mechanics)
		
		for (var i = 0; i < currentClient.game.board.length; i++) {
			if (_.isEqual(currentClient.game.board[i].stats, traded_minions.friendlyMinion)) {
				for (var j = 0; j < currentClient.enemyClient.game.board.length; j++){
					if (currentClient.game.board[i].stats.canAttack && _.isEqual(currentClient.enemyClient.game.board[j].stats, traded_minions.enemyMinion)) {

						 currentClient.game.board[i].stats.canAttack = false;
						 var atk = currentClient.enemyClient.game.board[j].stats.attack;
						 var atk2 = currentClient.game.board[i].stats.attack;

						 currentClient.damage(i, atk, "friendlyMinion")
						 currentClient.damage(j, atk2, "enemyMinion")

						 currentClient.sync();
						 currentClient.enemyClient.sync();
						 return
					}
				}

			}
		} 
	});


	socket.on("attackEnemyHero", (minion_stat) => {
		if (!currentClient.turn || currentClient.enemyClient.boardHasTaunt() ) return
		for (var i = 0; i < currentClient.game.board.length; i++) {
			if (currentClient.game.board[i].stats.canAttack && _.isEqual(currentClient.game.board[i].stats, minion_stat)) {
				//currentClient.enemyClient.game.heroStats.hp -=  currentClient.game.board[i].stats.attack;
				currentClient.damage(-1, currentClient.game.board[i].stats.attack, "enemyHero")
				currentClient.game.board[i].stats.canAttack = false;

				currentClient.sync();
				currentClient.enemyClient.sync();
				return;
			}
		}

	})
	
});

setInterval( ()=>{ 
	// console.log(clients.length)
	//   if (clients[0] != undefined)
	//   for (var i = 0; i < clients[0].game.board.length; i++) console.log(clients[0].game.board[i]);
	  //for (var i = 0; i < rooms.length; i++)   console.log(rooms[i])
}, 1000); 