const http = require('http');
const fs = require('fs/promises');
const path = require('path');

const hostname = '127.0.0.1';
const port = 3003;

const usersPath = path.join(__dirname, 'data', 'users.json');

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${hostname}:${port}`);
  const keys = [...url.searchParams.keys()];

  if (keys.length === 0) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Hello, World!');
    return;
  }

  if (keys.length === 1 && keys[0] === 'hello') {
    const name = url.searchParams.get('hello').trim();

    if (!name) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('Enter a name');
      return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end(`Hello, ${name}.`);
    return;
  }

  if (keys.length === 1 && keys[0] === 'users') {
    try {
      const users = await fs.readFile(usersPath, 'utf-8');

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(users);
    } catch {
      res.statusCode = 500;
      res.end();
    }
    return;
  }

  res.statusCode = 500;
  res.end();
});

server.listen(port, hostname, () => {
  console.log(`Сервер запущен по адресу http://${hostname}:${port}`);
});