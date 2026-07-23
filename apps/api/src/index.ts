import http from 'node:http';

const server = http.createServer((req, res) => {
  console.log('----- New Request -----');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', req.headers);

  if (req.method === 'GET' && req.url === '/') {
    res.end('Welcome to pulse!!');
  } else if (req.method === 'GET' && req.url === '/health') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  } else if (req.method === 'POST' && req.url === '/events') {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => {
      chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        const bodyBuffer = Buffer.concat(chunks);
        const body = bodyBuffer.toString();
        const event = JSON.parse(body);

        const allowedEventTypes = new Set(['page_view', 'click', 'purchase']);

        if (!event.type) {
          res.statusCode = 400;
          res.setHeader('content-type', 'application/json');
          res.end(JSON.stringify({ message: 'Type is required' }));
          return;
        }
        if (typeof event.type !== 'string') {
          res.statusCode = 400;
          res.setHeader('content-type', 'application/json');
          res.end(JSON.stringify({ message: 'type must be string' }));
          return;
        }
        if (!allowedEventTypes.has(event.type)) {
          res.statusCode = 400;
          res.setHeader('content-type', 'application/json');
          res.end(JSON.stringify({ message: 'Invalid Event Type' }));
          return;
        }
        if (!event.url) {
          res.statusCode = 400;
          res.setHeader('content-type', 'application/json');
          res.end(JSON.stringify({ message: 'Url is required' }));
          return;
        }
        if (typeof event.url !== 'string') {
          res.statusCode = 400;
          res.setHeader('content-type', 'application/json');
          res.end(JSON.stringify({ message: 'url must be string' }));
          return;
        }
        res.end(JSON.stringify(event));
      } catch {
        res.statusCode = 400;
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({ message: 'Invalid JSON' }));
        return;
      }
    });
  } else {
    res.statusCode = 404;
    res.end('404');
  }
});

server.listen(3000, () => {
  console.log('server is running on localhost:3000');
});
