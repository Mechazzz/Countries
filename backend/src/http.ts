import http from "http";

// először simán szervert csiálo, ami jsont ad vissza

const server = http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    if (req.url === "/api/countries") {
      return res.end(
        JSON.stringify({
          data: ["Finnország", "Dánia"],
        })
      );
    }
    if (req.url === "/api/cities") {
      return res.end(
        JSON.stringify({
          data: ["Helsinki", "Koppenhága"],
        })
      );
    }
    return res.end(
      JSON.stringify({
        data: "invalid url",
      })
    );
  })
  .listen(4000);
