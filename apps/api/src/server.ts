import http from 'node:http';
import app from './app.js';

const server = http.createServer(app);
server.listen(3000, () => {
  console.log('server is running on localhost:3000');
});
