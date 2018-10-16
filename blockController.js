var express = require('express');
var bc = require('./simpleChain');
var router = express.Router();

router.post('/', (req, res) => {
    let blockchain = new bc.Blockchain()
    if(req.body.body !== undefined && typeof req.body.body === 'string' && req.body.body.trim() !== ''){
        blockchain.addBlock(new bc.Block(req.body.body)).then(value => {
            res.send(value)
        })
    }else {
        res.json(`The body key should not be empty.`)
    }
});


router.get('/:blockHeight', (req, res) => {
    let blockchain = new bc.Blockchain()
    blockchain.getBlock(req.params.blockHeight).then(
        value => res.send(value)
    ).catch(reason => {res.send(`The block of height ${req.params.blockHeight} doesn't exist.`)})
});



module.exports = router;