## Description
first
[AudioFeedback](https://github.com/AudioFeedback/backend) AudioFeedback challenge ID

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=AudioFeedback_backend&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=AudioFeedback_backend)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=AudioFeedback_backend&metric=bugs)](https://sonarcloud.io/summary/new_code?id=AudioFeedback_backend)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=AudioFeedback_backend&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=AudioFeedback_backend)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=AudioFeedback_backend&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=AudioFeedback_backend)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=AudioFeedback_backend&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=AudioFeedback_backend)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=AudioFeedback_backend&metric=coverage)](https://sonarcloud.io/summary/new_code?id=AudioFeedback_backend)

## Installation

```bash
$ npm install
$ npx prisma migrate dev --name init
```
> Na een verandering in het prisma model kan het handig zijn om de database te "resetten" en deze opnieuw te seeden. Gebruik dan de volgende command:
```bash
$ npm run reset
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

## Build docker

```bash
# build container
$ docker build -t backend:latest

# run docker compose
$ docker compose up
```
