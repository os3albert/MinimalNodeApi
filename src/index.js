import { loadEnvFile } from "process";
import http from "http";
import { ProductService } from "./services/prodotti.js";
import { SystemService } from "./services/system.js";

// vari modi per caricare le variabili d'ambiente in node.js -> https://nodejs.org/learn/command-line/how-to-read-environment-variables-from-nodejs
// questo file usa gli ESM (i moduli) e non gli CJS (il vecchio commonjs che si usava lato backend con node) gli import sono diversi vedi sopra uno usa require l'altro import/export
// vincono i valori del file che vengono dichiarati prima in questo caso le variabili di sviluppo
loadEnvFile("./src/config/.development.env");
// loadEnvFile("./config/.env");

const PORT = process.env.PORT;

const server = http.createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let statusCode = 404;

  // req.method → 'GET', 'POST', ...
  switch (req.method) {

    case "GET":
      switch (true) {

        // path: /
        case /^\/$/.test(req.url):
          statusCode = 200;
          res.writeHead(statusCode);
          res.end(JSON.stringify({ message: "Server attivo" }));
          break;

        // path: /about
        case /^\/about$/.test(req.url):
          statusCode = 200;
          res.writeHead(statusCode);
          res.end(JSON.stringify({ app: "node-server", versione: "1.0.0" }));
          break;

        // path: /prodotti
        case /^\/prodotti$/.test(req.url):
          statusCode = 200;
          res.writeHead(statusCode);
          res.end(JSON.stringify(await ProductService.getProducts()));
          break;

        // path: /prodotti/:id
        case /^\/prodotti\/([\d]+)$/.test(req.url): {
          // see: https://forum.freecodecamp.org/t/problem-with-regular-expressions/360005
          const extractStr = req.url;
          const codingRegex = /\d+/;
          const id = extractStr.match(codingRegex);
          try {
            const findedProduct = await ProductService.getProductById(id);
            statusCode = 200;
            res.writeHead(statusCode);
            res.end(JSON.stringify(findedProduct));
          } catch (error) {
            const codeError = JSON.parse(error.message);
            statusCode = codeError.status;
            res.writeHead(statusCode);
            res.end(JSON.stringify({error: codeError.message}))
          }
          break;
        }

        // path: /status
        case /^\/status$/.test(req.url):
          statusCode = 200;
          res.writeHead(statusCode);
          res.end(JSON.stringify(SystemService));
          break;

        default:
          res.writeHead(statusCode);
          res.end(JSON.stringify({ error: "Rotta non trovata" }))
          break;
      }
      break;

    case "POST":
      break;

    default:
      break;
  }
  const now = new Date(Date.now());
  // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
  const isoTimestamp = now.toISOString();
  // [ISO timestamp] METHOD /path → statusCode
  console.log(`[${isoTimestamp}] ${req.method} ${req.url} → ${statusCode}`);
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
