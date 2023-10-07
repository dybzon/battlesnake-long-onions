export function getSafeMoves(you, occupiedFields, board) {
  const moves = [];
  if (canMoveUp(you, occupiedFields, board)) moves.push('up');
  if (canMoveRight(you, occupiedFields, board)) moves.push('right');
  if (canMoveDown(you, occupiedFields, board)) moves.push('down');
  if (canMoveLeft(you, occupiedFields, board)) moves.push('left');
  return moves;
}

function canMoveUp(you, occupiedFields, board) {
  const head = you.body[0];
  const coord = { ...head };
  coord.y++;
  return isCoordSafe(coord, occupiedFields, board);
}

function canMoveRight(you, occupiedFields, board) {
  const head = you.body[0];
  const coord = { ...head };
  coord.x++;
  return isCoordSafe(coord, occupiedFields, board);
}

function canMoveDown(you, occupiedFields, board) {
  const head = you.body[0];
  const coord = { ...head };
  coord.y--;
  return isCoordSafe(coord, occupiedFields, board);
}

function canMoveLeft(you, occupiedFields, board) {
  const head = you.body[0];
  const coord = { ...head };
  coord.x--;
  return isCoordSafe(coord, occupiedFields, board);
}

function isCoordSafe(coord, occupiedFields, board) {
  // coord is out of bounds
  if (isOutOfBounds(coord, board)) return false;

  // coord is occupied
  if (occupiedFields.some(f => f.x === coord.x && f.y === coord.y)) return false;
  return true;
}

function isOutOfBounds(coord, board) {
  return coord.x < 0 || coord.y < 0 || coord.x >= board.width || coord.y >= board.height;
}

