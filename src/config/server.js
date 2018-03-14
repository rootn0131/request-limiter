const { env } = process;

export default {
  redisUri: env.REDIS_URI || '127.0.0.1',
  redisPort: env.REDIS_PORT || '6379',
  host: env.HOST || '127.0.0.1',
  port: env.PORT || '8000',
};
