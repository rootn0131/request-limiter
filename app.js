const express = require('express');
const app = express()

const redis = require('redis');
const client = redis.createClient();

const MAXreq = 10;
const timeRange = 10;

const rateLimiter = (req, res, next) => {
  console.log(req.ip);
  client.zrange(req.ip, 0, -1, function (err, reply) {
    const lastRequestTimeDelta = Date.now() - reply[reply.length - 1 - MAXreq];
    if (reply.length > MAXreq && lastRequestTimeDelta <= timeRange * 1000) {
      res.set('X-RateLimit-Remaining', 0);
      res.set('X-RateLimit-Reset', new Date(parseInt(reply[reply.length - 1 - MAXreq]) + timeRange * 1000));
      res.sendStatus(429);
    }
    else {
      const framedRequests = reply.filter(client => client > Date.now() - timeRange * 1000);
      res.set('X-RateLimit-Remaining', MAXreq - framedRequests.length);
      const resetDate = new Date(parseInt(framedRequests[framedRequests.length - 1]) + timeRange * 1000);
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

client.on('connect', function () {
  console.log('connected');
});

app.listen(8000, () => console.log('Example app listening on port 8000!'))