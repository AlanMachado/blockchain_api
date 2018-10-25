var express = require('express');
const bitcoinMessage = require('bitcoinjs-message')
const SHA256 = require('crypto-js/sha256');
const Joi = require('joi')
var router = express.Router();
const db = require('../validationRequestDb');
const uf = require('../util/functions')


class Request {
    constructor(address) {
        this.address = address
        this.requestTimeStamp = new Date().getTime().toString().slice(0,-3);
        this.message = this.mountMessage()
    }

    mountMessage() {
        return this.address + ":" + this.requestTimeStamp + ":starRegistry"
    }
}

class MessageValidation {
    constructor(registerStar) {
        this.registerStar = registerStar

    }
}

let schemaRequestValidation = {address: Joi.string().alphanum().required()}

let schemaMessageSignature = {
    address: Joi.string().required(),
    signature: Joi.string().required()
}

router.post('/requestValidation', (req, res) => {

    Joi.validate(req.body, schemaRequestValidation).then(body => {
        db.getLevelDBData(body.address).then( requestValidation => {
            if(uf.calculateValidationWindow(requestValidation) <= 0){
                requestValidation.requestTimeStamp = new Date().getTime().toString().slice(0,-3)
                db.addLevelDBData(body.address, requestValidation)
                requestValidation['validationWindow'] = uf.initialValidationWindow()
            }else {
                requestValidation['validationWindow'] = uf.calculateValidationWindow(requestValidation)
            }
            res.send(requestValidation)
        }, reason => {
            let v = new Request(body.address)
            db.addLevelDBData(body.address, v)
            v['validationWindow'] = uf.initialValidationWindow();
            res.send(v)
        })
    }, reason => {
        res.send(reason.message)
    })

});

router.post('/message-signature/validate', (req, res) => {

    Joi.validate(req.body, schemaMessageSignature).then(body => {
        db.getLevelDBData(body.address).then( requestValidation => {
            let validationWindow = uf.calculateValidationWindow(requestValidation);

            if(validationWindow > 0){
                let messageValidation = new MessageValidation(false)
                requestValidation['messageSignature'] = 'invalid'
                if(bitcoinMessage.verify(requestValidation.message, requestValidation.address, body.signature)) {
                    messageValidation.registerStar = true
                    requestValidation.messageSignature = 'valid'
                }

                //update requestValidation
                db.addLevelDBData(requestValidation.address, requestValidation)

                requestValidation['validationWindow'] = validationWindow
                messageValidation['status'] = requestValidation
                res.send(messageValidation)
            }else {
                res.send('Validation Window ended, please do another request.')
            }
        })
    }, reason => {
        res.send(reason.message)
    })
})

module.exports = router;