import { GameState, Coord } from './types';

export function getOccupiedFields(state: GameState) {
  const fields = state.board.snakes
    .map(s => s.body.slice(0, -1)) // Remove the tail from each snake. It will be gone next turn.
    .flatMap(c => c);

  // Add potential fields head fields for snakes that are our size or larger
  const largeSnakes = state.board.snakes.filter(s => s.id !== state.you.id && s.body.length >= state.you.body.length);
  const potentialLargeSnakeHeadCoords = largeSnakes.flatMap(s => {
    const head = s.body[0];
    const neck = s.body[1];
    const potentialCoords: Coord[] = [];
    if (head.y >= neck.y) potentialCoords.push({ x: head.x, y: head.y + 1 });
    if (head.y <= neck.y) potentialCoords.push({ x: head.x, y: head.y - 1 });
    if (head.x >= neck.x) potentialCoords.push({ x: head.x + 1, y: head.y });
    if (head.x <= neck.x) potentialCoords.push({ x: head.x - 1, y: head.y });
    return potentialCoords;
  });

  return fields.concat(potentialLargeSnakeHeadCoords);
}