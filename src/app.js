import { server } from 'config';
import express from 'express';
import redis from 'redis';

const app = express();
const client = redis.createClient(server.redisPort, server.redisUri);

const MAXreq = 10;
const timeRange = 10;

const rateLimiter = (req, res, next) => {
  console.log(req.ip);
  client.zrange(req.ip, 0, -1, (err, reply) => {
    const lastRequestTimeDelta = Date.now() - reply[reply.length - 1 - MAXreq];
    if (reply.length > MAXreq && lastRequestTimeDelta <= timeRange * 1000) {
      res.set('X-RateLimit-Remaining', 0);
      res.set('X-RateLimit-Reset', new Date(parseInt(reply[reply.length - 1 - MAXreq], 10) + timeRange * 1000));
      res.sendStatus(429);
    } else {
      const framedRequests = reply.filter(connectionTime => connectionTime > Date.now() - timeRange * 1000);
      res.set('X-RateLimit-Remaining', MAXreq - framedRequests.length);
      const resetDate = new Date(parseInt(framedRequests[framedRequests.length - 1], 10) + timeRange * 1000);
      res.set('X-RateLimit-Reset', resetDate);
      client.zadd(req.ip, Date.now(), Date.now());
      next();
    }
  });
};

app.use(rateLimiter);

app.get('/', (req, res) => {
  res.send('hi');
});

client.on('connect', () => {
  console.log('connected');
});

app.listen(server.port, () => console.log(`Server is listening on ${server.host}:${server.port}`));
