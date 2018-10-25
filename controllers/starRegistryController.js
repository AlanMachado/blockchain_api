var express = require('express');
var bc = require('../simpleChain');
const requestDb = require('../validationRequestDb');
const Joi = require('joi')
const uf = require('../util/functions')
var router = express.Router();

const schema = Joi.object().keys({
    address: Joi.string().alphanum().required(),
    star: Joi.object().keys({
        ra: Joi.string().required(),
        dec: Joi.string().required(),
        mag: Joi.string(),
        con: Joi.string(),
        story: Joi.string().max(500, 'ascii').required()

        /*ra: Joi.string().regex(/([0-9]+)h ([0-9]+)m ([0-5][0-9].[0-9])s/).required(),
          dec: Joi.string().regex(/[-|\+]*[0-9]+º [0-5][0-9]' [0-5][0-9].[0-9]/).required(),
          mag: Joi.string().regex(/[0-9]+.[0-9]/),*/

        /*ra: Joi.string().required(),
        dec: Joi.string().required(),
        mag: Joi.string().regex(/[0-9]+.[0-9]/),
        cons: Joi.string().alphanum(),
        story: Joi.string().max(500, 'ascii').required()*/
    }).required()
});




router.post('/', (req, res) => {

    Joi.validate(req.body, schema, function (err, value) {
        if(err) {
            res.send(err.message)
        }else {
            requestDb.getLevelDBData(req.body.address).then(requestValidation => {
                if(requestValidation['messageSignature'] !== undefined && requestValidation['messageSignature'] === 'valid'){
                    if(uf.calculateValidationWindow(requestValidation) > 0) {
                        let blockchain = new bc.Blockchain()
                        req.body.star.story = Buffer.from(req.body.star.story).toString('hex')
                        blockchain.addBlock(new bc.Block(req.body)).then(value => {
                            requestDb.deleteData(req.body.address).then(result => {
                                res.send(value)
                            })
                        })
                    }else {
                        res.send(`Validation Window expired, please do another request.`)
                    }

                }else {
                    res.send(`Signature for the address ${req.body.address} is invalid or the request was not signed.`)
                }

            }, reason => {
                res.status(404).send(`There is no request available for the address ${req.body.address}`)
            })
        }

    });


});



router.get('/:blockHeight', (req, res) => {
    let blockchain = new bc.Blockchain()
    blockchain.getBlock(req.params.blockHeight).then(
        block => {
            res.send(block)
        }
    ).catch(reason => {res.send(`The block of height ${req.params.blockHeight} doesn't exist.`)})
});



module.exports = router;