// Welcome to
// __________         __    __  .__                               __
// \______   \_____ _/  |__/  |_|  |   ____   ______ ____ _____  |  | __ ____
//  |    |  _/\__  \\   __\   __\  | _/ __ \ /  ___//    \\__  \ |  |/ // __ \
//  |    |   \ / __ \|  |  |  | |  |_\  ___/ \___ \|   |  \/ __ \|    <\  ___/
//  |________/(______/__|  |__| |____/\_____>______>___|__(______/__|__\\_____>
//
// This file can be a nice home for your Battlesnake logic and helper functions.
//
// To get you started we've included code to prevent your Battlesnake from moving backwards.
// For more info see docs.battlesnake.com

import runServer from './server';
import { GameState, InfoResponse, MoveResponse, Move, Battlesnake, Board, Coord } from './types';
import { getOccupiedFields } from './getOccupiedFields'
import { getSafeMoves } from './getSafeMoves'

// info is called when you create your Battlesnake on play.battlesnake.com
// and controls your Battlesnake's appearance
// TIP: If you open your Battlesnake URL in a browser you should see this data
function info(): InfoResponse {
  console.log("INFO");

  return {
    apiversion: "1",
    author: "dybzon",
    color: "#B2560D",
    head: "bonhomme",
    tail: "weight",
  };
}

// start is called when your Battlesnake begins a game
function start(gameState: GameState): void {
  console.log("GAME START");
}

// end is called when your Battlesnake finishes a game
function end(gameState: GameState): void {
  if (gameState.board.snakes.some(s => s.id === gameState.you.id)) {
    console.log("YOU WIN\n");
  } else {
    console.log("GAME OVER - YOU LOSE\n");
  }
}

// move is called on every turn and returns your next move
// Valid moves are "up", "down", "left", or "right"
// See https://docs.battlesnake.com/api/example-move for available data
function move(gameState: GameState): MoveResponse {
  console.log(gameState.turn);

  const occupiedFields = getOccupiedFields(gameState);

  // Get moves that are safe
  const safeMoves = getSafeMoves(gameState.you, occupiedFields, gameState.board);
  if (safeMoves.length === 0) return { move: 'down' };

  const preferredMoves = getPreferredMoves(gameState.you, gameState.board);
  
  // Pick the first safe move if we don't explicitly seek food
  if (!shouldSeekFood(gameState.you, gameState.board.snakes)) {
    return { move: getPreferredMove(safeMoves, preferredMoves) };
  }

  const closestFoodCoord = getClosestRelevantFoodCoord(gameState.you, gameState.board.snakes, gameState.board.food);
  if (!closestFoodCoord) {
    return { move: getPreferredMove(safeMoves, preferredMoves) };
  }

  // Find the directions we need to move in to go towards the closest food
  const attractiveDirections = getDirections(gameState.you.body[0], closestFoodCoord);

  // Move in one of the attractive directions, if they overlap with a safe move
  const attractiveSafeMoves = safeMoves.filter(m => attractiveDirections.includes(m));
  if (attractiveSafeMoves.length > 0) {
    return { move: getPreferredMove(attractiveSafeMoves, preferredMoves) };
  }

  // More considerations: 
  // If we're same distance from a food as another snake, then move towards it if we're bigger than them
  // Are we close to other snakes (and are they bigger or smaller)?
  // Prefer moving towards the center of the board rather than the edge?

  // Lower prio - won't happen until late game
  // Are we close to being blocked?
  // Are we able to block another snake?

  return { move: getRandomMove(safeMoves) };
}

function getPreferredMove(safeMoves: Move[], preferredMoves: Move[]): Move {
    const preferredSafeMoves = safeMoves.filter(m => preferredMoves.includes(m));
    const preferredMove = preferredSafeMoves.length === 0 ? getRandomMove(safeMoves) : getRandomMove(preferredSafeMoves);
    return preferredMove;
}

function getRandomMove(moves: Move[]): Move {
  return moves[Math.floor(Math.random()*moves.length)];
}

// We'll prefer moving towards the middle if we're in the outer two lanes in any direction
// We'll also prefer not to move into the outer two lanes in general.
function getPreferredMoves(you: Battlesnake, board: Board): Move[] {
  const head = you.body[0];
  const moves: Move[] = [];
  if(head.x > 2) moves.push('left');
  if(head.x < board.width - 3) moves.push('right');
  if(head.y > 2) moves.push('down');
  if(head.y < board.height - 3) moves.push('up');
  return moves;
}

// Determine whether we want to seek food
// The idea here is that it's better to stay small because this increase the number of safe moves over time
function shouldSeekFood(you: Battlesnake, snakes: Battlesnake[]): boolean {
  // We should consider the ruleset settings here too.
  // gameState.game.ruleset.settings.foodSpawnChance
  // gameState.game.ruleset.settings.minimumFood

  // If our health drops below 20 + the number of snakes times 5, then we should move towards food
  // There are always a minimum of two snakes (us + another), which means this value is always 30 or more.
  if (you.health < 20 + snakes.length * 5) return true;
  return false;
}

function getDirections(from: Coord, to: Coord): Move[] {
  const moves: Move[] = [];
  if (from.y < to.y) moves.push('up');
  if (from.y > to.y) moves.push('down');
  if (from.x < to.x) moves.push('right');
  if (from.x > to.x) moves.push('left');
  return moves;
}

// Get the coord of the closest relevant food.
// This is the closest food where no other snakes at closer than us.
function getClosestRelevantFoodCoord(you: Battlesnake, snakes: Battlesnake[], foodCoords: Coord[]): Coord | null {
  const head = you.body[0];
  const foodByDistance = foodCoords.map(f => {
    const distance = measureDistance(f, head)
    return { distance, coord: f };
  }).sort((a, b) => a.distance - b.distance);

  const enemySnakeHeads = snakes.filter(s => s.id !== you.id).map(s => s.body[0]);

  // Figure out if other snakes are closer
  for (let foodIndex = 0; foodIndex < foodByDistance.length; foodIndex++) {
    const food = foodByDistance[foodIndex];
    if (!enemySnakeHeads.some(h => measureDistance(h, food.coord) < food.distance)) {
      return food.coord;
    }
  }

  return null;
}

function measureDistance(a: Coord, b: Coord): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

runServer({
  info: info,
  start: start,
  move: move,
  end: end
});
