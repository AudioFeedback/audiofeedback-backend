## Description

[AudioFeedback](https://github.com/AudioFeedback/backend) AudioFeedback challenge ID

## Installation

```bash
$ npm install
$ npx prisma migrate dev --name init
```
> Na een verandering in het prisma model kan het handig zijn om de database te "resetten" en deze opnieuw te seeden. Gebruik dan de volgende command:
```bash
$ npx prisma db push --force-reset && npx prisma db seed
$ npx prisma migrate reset
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```