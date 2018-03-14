import express from 'express';
import { server } from 'config';
import { rateLimiter } from 'middleware';
import { client } from 'database';

const app = express();

app.use(rateLimiter);

app.get('/', (req, res) => {
  res.send('hi');
});

client.on('connect', () => {
  console.log('connected');
});

app.listen(server.port, () => console.log(`Server is listening on ${server.host}:${server.port}`));
