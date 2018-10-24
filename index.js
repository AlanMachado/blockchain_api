const express = require('express')
const blockController = require('./blockController')
const starRegistryController = require('./controllers/starRegistryController')
const lookupStarController = require('./controllers/lookupStarController')
const validationController = require('./controllers/validationController')
const Blockchain = require('./simpleChain').Blockchain;
const bodyParser = require('body-parser')
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
//app.use('/block', blockController)
app.use('/block', starRegistryController)
app.use('/stars', lookupStarController)
app.use(validationController)


app.listen(8000, () => {
    console.log('Initializing blockchain.')
    let bc = new Blockchain()
    console.log('Example app listening on port 8000!');
})
