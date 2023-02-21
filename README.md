# TIPA Backend

## Setup

install `nvm` - nodejs version manager

https://github.com/nvm-sh/nvm#installing-and-updating

## Development

```bash
# switch to required node version (check .nvmrc)
nvm use

# install dependencies
npm install

# create nodemon.json, nodemon.release.json & nodemon.master.json files from nodemon.example.json, and after update them with correct configuration
cp nodemon.example.json nodemon.json

# run api
npm run api:dev

# run tests
npm run test
```