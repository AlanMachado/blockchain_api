var express = require('express');
const chaindb = require('../levelSandbox');

var router = express.Router();


router.get('/address::address', (req, res) => {

    chaindb.getBlocksByAddress(req.params.address).then(stars => {
        if(stars !== undefined) {
            res.send(stars)

        }else {
            res.status(404).send('No star found')
        }
    }, reason => {
        res.status(500).send('Stars could not be reached')
    })
})

router.get('/hash::hash', (req, res) => {

    chaindb.getBlockByHash(req.params.hash).then(star => {
        if(star !== undefined) {
            res.send(star)
        }else {
            res.status(404).send('No star found')
        }
    }, reason => {
        res.status(500).send('Star could not be reached')
    })
})

module.exports = router;