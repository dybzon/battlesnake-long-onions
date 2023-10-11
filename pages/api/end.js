export default function handler(req, res) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  end(req.body);
  res.send("ok");
}

// end is called when your Battlesnake finishes a game
function end(gameState) {
  if (gameState.board.snakes.some(s => s.id === gameState.you.id)) {
    console.log("YOU WIN\n");
  } else {
    console.log("GAME OVER - YOU LOSE\n");
  }
}