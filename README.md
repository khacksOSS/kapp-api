# kapp-api

Karunya App's API built with node.js and mongodb.

# Setup

## Prerequisites

Before starting to test this **API** locally you need to assure you have the following
prerequisites:

- **Node.JS** see: [Installing Node.js](https://nodejs.org/)

- **npm** see: [Installing npm](https://www.npmjs.com/get-npm)

- **MongoDB** see: [Installing MongoDB](https://docs.mongodb.com/manual/installation/)

## Installation and usage

1. Clone the repo and install all the required packages:

```
 git clone https://github.com/khacksOSS/kapp-api.git
 cd kapp-api/
 npm install
```

2. Run command `npm run dev`

3. Test by sending requests at `localhost:2500`

## Testing

1. To run all the tests with mocha:

```
 npm run test
```

2. To test with jest:

```
 npm run test-jest
```

# Commiting/pushing to repo

1. Run prettier to indent code

```
	npm run prettier:write
```

2. Run eslint to check for potential bugs

```
 npm run lint
```

3. To auto fix few errors

```
 npm run lint:fix
```
