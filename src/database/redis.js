import redis from 'redis';
import { server } from 'config';

const client = redis.createClient(server.redisPort, server.redisUri);

export default client;
