# Music Web App

This is a music app that was build as a home assignment for a company.

## Architecture

The app is built as monorepo just for the sake of simplicity.

### API

The API is built with Nest.js and uses Module-based architecture that is common for NestJS apps. It's easy to add new modules and services to the app but it is also a little bit overkill for this simple app. SQLite/Prisma is used as a database.

### Web

The web is built with Next.js and uses tailwind/shadcn for styling. Here I chose the mix of Feature-based architecture and Feature-sliced design to handle the simplicity of the app and make it easier to scale.


### Setup

```sh
# Installation
1. npm install turbo # to install dependencies
2. npm run init # to initialize the project

# Development
npm run dev # to start the app

# Production
1. # change the environment variables in the `.env` files
2. npm run build # to build the app
3. npm run start # to run the built version
```

### Commands

```sh
npm install turbo # install dependencies
npm run dev # start the app
npm run build # build the app
npm run start # run the built version
npm run format # format the code
npm run lint # lint the code
```
