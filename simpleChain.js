/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');
const LEVEL = require('./levelSandbox.js');


/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block{
	constructor(data){
     this.hash = "",
     this.height = 0,
     this.body = data,
     this.time = 0,
     this.previousBlockHash = ""
    }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain{
  constructor(){
    this.getBlock(0).catch(reason => this.addBlock(new Block("First block in the chain - Genesis block")));
  }

  // Add new block
  addBlock(newBlock){

    newBlock.time = new Date().getTime().toString().slice(0,-3);

    return this.getBlockHeight().then(value => {
        newBlock.height = value+1
        return this.getBlock(value)
    }).then(block => {
        newBlock.previousBlockHash = block.hash;
        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
        return LEVEL.addLevelDBData(newBlock.height, newBlock)
    }, err => {
        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
        return LEVEL.addLevelDBData(newBlock.height, newBlock)
    })
  }

  // Get block height
    getBlockHeight(){
      return LEVEL.getBlockHeight();
    }

    // get block
    getBlock(blockHeight){
      return LEVEL.getLevelDBData(blockHeight);
    }

    // validate block
    validateBlock(blockHeight){
      // get block object
      return this.getBlock(blockHeight)
          .then(value => {
              let blockHash = value.hash;
              value.hash = '';
              let validBlockHash = SHA256(JSON.stringify(value)).toString();

              return new Promise((resolve, reject) => {
                  resolve(validBlockHash === blockHash)
              })
          })
    }



    validateChain(){
      //let errorLog = [];

      LEVEL.getChain().then(errorLog => {
          if (errorLog.length>0) {
              console.log('Block errors = ' + errorLog.length);
              console.log('Blocks: '+errorLog);
          } else {
              console.log('No errors detected');
          }

      });
    }
}

module.exports = {Block, Blockchain}