import { createServer } from "http";
import next from "next";
import { parse } from "url";
import { getIO } from "./lib/socket";

const dev = process.argv.includes("--dev");
const hostname = "0.0.0.0";
const port = Number(process.env.PORT ?? 3000);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url ?? "/", true);
    handle(req, res, parsedUrl);
  });

  getIO(server);

  server.listen(port, hostname, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
