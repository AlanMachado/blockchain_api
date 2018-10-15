# Blockchain Data

Blockchain has the potential to change the way that the world approaches data. Develop Blockchain skills by understanding the data model behind Blockchain by developing your own simplified private blockchain.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].

### Configuring your project

- Use NPM to initialize your project and create package.json to store project dependencies.
```
npm init
```
- Install crypto-js with --save flag to save dependency to our package.json file
```
npm install crypto-js --save
```
- Install level with --save flag
```
npm install level --save
```
- Install express with --save flag
```
npm install express --save
```
- Install body-parser with --save flag
```
npm install body-parser --save
```

### Endpoints

- localhost:8000/block/[block_height], mapped with get, returns the block of height passed as parameter as a json.
```
localhost:8000/block/0
```
- localhost:8000/block, mapped with post, must receive a json with a property 'body' and the value must be a string.
Returns the generated block.
```
localhost:8000/block

body example:

{
   "body": "Testing block with test string data"
}
```
