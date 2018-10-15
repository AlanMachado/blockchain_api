const express = require('express')
const blockController = require('./blockController')
const bodyParser = require('body-parser')
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use('/block', blockController)


app.listen(8000, () => console.log('Example app listening on port 8000!'))
