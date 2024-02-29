import express from "./express.Lib";

// először simán szervert csiálo, ami jsont ad vissza

const server = express();

server.get("/api/countries", (req, res) => {
  res.json({
    data: ["Finnország", "Dánia"],
  });
});

server.get("/api/cities", (req, res) => {
  res.json({
    data: ["Helsinki", "Koppenhága"],
  });
});

server.listen(4001);
