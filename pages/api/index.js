export default function handler(req, res) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");

  const snakeInfo = {
    apiversion: "1",
    author: "dybzon",
    color: "#B2560D",
    head: "bonhomme",
    tail: "weight",
  };

  res.json(snakeInfo);
}
