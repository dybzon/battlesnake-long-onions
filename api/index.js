const app = require('express')();
const { v4 } = require('uuid');

app.get('/api', (req, res) => {
  const path = `/api/item/${v4()}`;
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});

app.get('/api/item/:slug', (req, res) => {
  const { slug } = req.params;
  res.end(`Item: ${slug}`);
});

module.exports = app;












// import { getOccupiedFields } from '../getOccupiedFields.js'
// import { getSafeMoves } from '../getSafeMoves.js'
// import express from "express"

// const app = express();
// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send(info());
// });

// app.post("/start", (req, res) => {
//   start(req.body);
//   res.send("ok");
// });

// app.post("/move", (req, res) => {
//   res.send(move(req.body));
// });

// app.post("/end", (req, res) => {
//   end(req.body);
//   res.send("ok");
// });

// app.use(function(req, res, next) {
//   res.set("Server", "long onions");
//   next();
// });

// const host = '0.0.0.0';
// const port = parseInt(process.env.PORT || '1337');

// app.listen(port, host, () => {
//   console.log(`Running long onions Battlesnake at http://${host}:${port}...`);
// });



// // info is called when you create your Battlesnake on play.battlesnake.com
// // and controls your Battlesnake's appearance
// // TIP: If you open your Battlesnake URL in a browser you should see this data
// function info() {
//   console.log("INFO");

//   return {
//     apiversion: "1",
//     author: "dybzon",
//     color: "#B2560D",
//     head: "bonhomme",
//     tail: "weight",
//   };
// }

// // start is called when your Battlesnake begins a game
// function start(gameState) {
//   console.log("GAME START");
// }

// // end is called when your Battlesnake finishes a game
// function end(gameState) {
//   if (gameState.board.snakes.some(s => s.id === gameState.you.id)) {
//     console.log("YOU WIN\n");
//   } else {
//     console.log("GAME OVER - YOU LOSE\n");
//   }
// }

// // move is called on every turn and returns your next move
// // Valid moves are "up", "down", "left", or "right"
// // See https://docs.battlesnake.com/api/example-move for available data
// function move(gameState) {
//   console.log(gameState.turn);

//   const occupiedFields = getOccupiedFields(gameState);

//   // Get moves that are safe
//   const safeMoves = getSafeMoves(gameState.you, occupiedFields, gameState.board);
//   if (safeMoves.length === 0) return { move: 'down' };

//   const preferredMoves = getPreferredMoves(gameState.you, gameState.board);
  
//   // Pick the first safe move if we don't explicitly seek food
//   if (!shouldSeekFood(gameState.you, gameState.board.snakes)) {
//     return { move: getPreferredMove(safeMoves, preferredMoves) };
//   }

//   const closestFoodCoord = getClosestRelevantFoodCoord(gameState.you, gameState.board.snakes, gameState.board.food);
//   if (!closestFoodCoord) {
//     return { move: getPreferredMove(safeMoves, preferredMoves) };
//   }

//   // Find the directions we need to move in to go towards the closest food
//   const attractiveDirections = getDirections(gameState.you.body[0], closestFoodCoord);

//   // Move in one of the attractive directions, if they overlap with a safe move
//   const attractiveSafeMoves = safeMoves.filter(m => attractiveDirections.includes(m));
//   if (attractiveSafeMoves.length > 0) {
//     return { move: getPreferredMove(attractiveSafeMoves, preferredMoves) };
//   }

//   // More considerations: 
//   // If we're same distance from a food as another snake, then move towards it if we're bigger than them
//   // Are we close to other snakes (and are they bigger or smaller)?
//   // Prefer moving towards the center of the board rather than the edge?

//   // Lower prio - won't happen until late game
//   // Are we close to being blocked?
//   // Are we able to block another snake?

//   return { move: getRandomMove(safeMoves) };
// }

// function getPreferredMove(safeMoves, preferredMoves) {
//     const preferredSafeMoves = safeMoves.filter(m => preferredMoves.includes(m));
//     const preferredMove = preferredSafeMoves.length === 0 ? getRandomMove(safeMoves) : getRandomMove(preferredSafeMoves);
//     return preferredMove;
// }

// function getRandomMove(moves) {
//   return moves[Math.floor(Math.random()*moves.length)];
// }

// // We'll prefer moving towards the middle if we're in the outer two lanes in any direction
// // We'll also prefer not to move into the outer two lanes in general.
// function getPreferredMoves(you, board) {
//   const head = you.body[0];
//   const moves = [];
//   if(head.x > 2) moves.push('left');
//   if(head.x < board.width - 3) moves.push('right');
//   if(head.y > 2) moves.push('down');
//   if(head.y < board.height - 3) moves.push('up');
//   return moves;
// }

// // Determine whether we want to seek food
// // The idea here is that it's better to stay small because this increase the number of safe moves over time
// function shouldSeekFood(you, snakes) {
//   // We should consider the ruleset settings here too.
//   // gameState.game.ruleset.settings.foodSpawnChance
//   // gameState.game.ruleset.settings.minimumFood

//   // If our health drops below 20 + the number of snakes times 5, then we should move towards food
//   // There are always a minimum of two snakes (us + another), which means this value is always 30 or more.
//   if (you.health < 20 + snakes.length * 5) return true;
//   return false;
// }

// function getDirections(from, to) {
//   const moves = [];
//   if (from.y < to.y) moves.push('up');
//   if (from.y > to.y) moves.push('down');
//   if (from.x < to.x) moves.push('right');
//   if (from.x > to.x) moves.push('left');
//   return moves;
// }

// // Get the coord of the closest relevant food.
// // This is the closest food where no other snakes at closer than us.
// function getClosestRelevantFoodCoord(you, snakes, foodCoords) {
//   const head = you.body[0];
//   const foodByDistance = foodCoords.map(f => {
//     const distance = measureDistance(f, head)
//     return { distance, coord: f };
//   }).sort((a, b) => a.distance - b.distance);

//   const enemySnakeHeads = snakes.filter(s => s.id !== you.id).map(s => s.body[0]);

//   // Figure out if other snakes are closer
//   for (let foodIndex = 0; foodIndex < foodByDistance.length; foodIndex++) {
//     const food = foodByDistance[foodIndex];
//     if (!enemySnakeHeads.some(h => measureDistance(h, food.coord) < food.distance)) {
//       return food.coord;
//     }
//   }

//   return null;
// }

// function measureDistance(a, b) {
//   return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
// }

// export default app;