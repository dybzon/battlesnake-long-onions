import express from "express"

export default function runServer(handlers) {
  const app = express();
  app.use(express.json());

  app.get("/", (req, res) => {
    res.send(handlers.info());
  });

  app.post("/start", (req, res) => {
    handlers.start(req.body);
    res.send("ok");
  });

  app.post("/move", (req, res) => {
    res.send(handlers.move(req.body));
  });

  app.post("/end", (req, res) => {
    handlers.end(req.body);
    res.send("ok");
  });

  app.use(function(req, res, next) {
    res.set("Server", "du har lange løg hvis du læser dette");
    next();
  });

  const host = '0.0.0.0';
  const port = parseInt(process.env.PORT || '1337');

  app.listen(port, host, () => {
    console.log(`Running long onions Battlesnake at http://${host}:${port}...`);
  });
}
