# Blockchain Data

Blockchain has the potential to change the way that the world approaches data. Develop Blockchain skills by understanding the data model behind Blockchain by developing your own simplified private blockchain.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].

### Configuring your project
- Node.js
```
To this section you need Node.js Installed, if you don't have Node. 
please follow the instructions in https://nodejs.org/en/
```
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
- Install joi with --save flag
```
npm install joi --save
```
- Install bitcoinjs-message with --save flag
```
npm install bitcoinjs-message --save
```

### Initializing Project

The entry point of the application is the index.js, to initialize it you simply need to use node. 

```
node index.js
```


### Endpoints

- localhost:8000/requestValidation, mapped with post, must receive a json with a property 'address' and the value must be a string.
Returns the generated request to validate.
```
localhost:8000/block

body example:

{
   "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ"
}

curl -X "POST" "http://localhost:8000/requestValidation" -H "Content-Type: application/json" -d $'{"address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ"}' 
```

- localhost:8000/message-signature/validate, mapped with post, must receive a json with properties 'address' and 'signature', both values are strings.
Returns the request validated and ready to add a star.
```
localhost:8000/block

body example:

{
   "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
   "signature": "H6ZrGrF0Y4rMGBMRT2+hHWGbThTIyhBS0dNKQRov9Yg6GgXcHxtO9GJN4nwD2yNXpnXHTWU9i+qdw5vpsooryLU="
}

curl -X "POST" "http://localhost:8000/message-signature/validate" -H "Content-Type: application/json" -d $'{"address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ", "signature": "H6ZrGrF0Y4rM...."}' 
```

- localhost:8000/block, mapped with post, must receive a json with properties 'address' and 'star', the first is a string and the second is an object.
Returns the generated block. The Object star must have the properties, ra (right ascension), dec (declination) and story, additionally, you can pass mag(magnitude) and con(constellation).  
```
localhost:8000/block

body example:

{
   "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ"
   "star": {
       "dec": "-26° 29' 24.9",
       "ra": "16h 29m 1.0s",
       "story": "Found star using https://www.google.com/sky/"
   }
}

curl -X "POST" "http://localhost:8000/block" -H "Content-Type: application/json" -d \
 $'{"address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ", "star":{"dec": "-26° 29'\'' 24.9", "ra": "16h 29m 1.0s", "story": "Found star using https://www.google.com/sky/"}}' 
```

- http://localhost:8000/stars/address:[address], mapped with get, you must pass your wallet address as a parameter, 
with that you will receive the stars registered to this address.
``` 
http://localhost:8000/stars/address:142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ

curl "http://localhost:8000/stars/address:142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ"
```

- http://localhost:8000/stars/hash:[hash], mapped with get, you must pass the hash generated after registry the star,
with that you will receive the star registered.
``` 
http://localhost:8000/stars/hash:a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f

curl "http://localhost:8000/stars/hash:a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f"
```

- http://localhost:8000/block/[height], mapped with get, you must pass the height of the block, you will receive the block of that height.
``` 
curl "http://localhost:8000/block/1"

curl "http://localhost:8000/block/1"
```
