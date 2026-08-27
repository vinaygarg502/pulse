import http from 'node:http';
import app from './app.js';
import './app/router/register.js';
import { config } from './app/config.js';

const server = http.createServer(app);
server.listen(config.port, () => {
  console.log('server is running on localhost:3000');
});
