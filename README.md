# Rate Limiter

## Information

### Current settings

* limits requests from the same IP within 10 seconds to 10, sends 429 status when exceeded
* sets X-RateLimit-Remaining to the remaining available requests
* sets X-RateLimit-Reset to the time when the rate limit is 0

## Development Environment

### Install dependencies

```
npm install
```

### NPM Scripts

* Start development server

```
npm run dev
```

### Project Structure

```
src
├── app.js
├── config
│   ├── index.js
│   ├── param.js
│   └── server.js
├── database
│   ├── index.js
│   └── redis.js
└── middleware
    ├── index.js
    └── rateLimiter.js
```

* `app.js`: entrance
* `config/`: Server configurations
* `database/`: Database configurations
* `middleware/`: middlewares.
