/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

// Add data to levelDB with key/value pair
module.exports = {
    addLevelDBData: function addLevelDBData(key,value){
      return new Promise((resolve, reject)=>{
          db.put(key, JSON.stringify(value), function(err) {
            if (err) return console.log('Block ' + key + ' submission failed', err);
            resolve(value)
          })
      })
    },

    // Get data from levelDB with key
    getLevelDBData: function getLevelDBData(key){

      return new Promise((resolve, reject) => {
          db.get(key, function(err, value) {

              if(err){
                  reject(err);
              }else {
                  let block = JSON.parse(value)
                  if(block.body.star !== undefined) {
                      let s = block.body.star.story
                      block.body.star['storyDecoded'] = Buffer.from(s, 'hex').toString('ascii')
                  }
                  resolve(block);
              }

          })
      })
    },

    // Add data to levelDB with value
    addDataToLevelDB: function addDataToLevelDB(value) {
        let i = 0;
        db.createReadStream().on('data', function (data) {
            i++;
        }).on('error', function (err) {
            return console.log('Unable to read data stream!', err)
        }).on('close', function () {
            console.log('Block #' + i);
            addLevelDBData(i, value);
        });
    },

    getBlockHeight: function getBlockHeight() {
        return new Promise((resolve, reject) => {
            let i = 0;
            db.createReadStream().on('data', function (data) {
                i++;
            }).on('close', function () {
                if(i > 0) {
                    resolve(i-1)
                }else {
                    reject(0)
                }
                resolve(i !== 0 ? i-1 : 0)
            })
        })
    },

    getChain: function getChain() {
        let blockHash;
        let errorLog = [];
        let dataNow;

        return new Promise((resolve, reject) => {
            db.createReadStream().on('data', function(data){

                //initiate variable
                dataNow = JSON.parse(data.value)
                if(blockHash === undefined) {
                    blockHash = dataNow.hash;
                }

                if(dataNow.height !== 0) {
                    if(blockHash !== dataNow.previousBlockHash) {
                        errorLog.push(dataNow.height)
                    }
                }
                //update hash
                blockHash = dataNow.hash;

                dataNow.hash = '';
                let validBlockHash = SHA256(JSON.stringify(dataNow)).toString();

                if(validBlockHash !== blockHash){
                    if(errorLog.indexOf(dataNow.height) === -1){
                        errorLog.push(dataNow.height)
                    }
                }
            }).on('error', function (err) {
                reject(err)
            }).on('close', function () {
                resolve(errorLog)
            })
        })
    },

    getBlocksByAddress: function (address) {
        let blocks = [];

        return new Promise((resolve, reject) => {
            db.createReadStream().on('data', function (data) {
                let block = JSON.parse(data.value)
                if(block.body.address === address){
                    if(block.body.star !== undefined) {
                        let s = block.body.star.story
                        block.body.star['storyDecoded'] = Buffer.from(s, 'hex').toString('ascii')
                    }
                    blocks.push(block)
                }
            }).on('error', function (err) {
                reject(err)
            }).on('close', function () {
                resolve(blocks)
            })
        })
    },

    getBlockByHash: function (hash) {
        let blockFound;
        return new Promise((resolve, reject) => {
            db.createReadStream().on('data', function (data) {
                let block = JSON.parse(data.value)
                if(block.hash === hash){
                    if(block.body.star !== undefined) {
                        let s = block.body.star.story
                        block.body.star['storyDecoded'] = Buffer.from(s, 'hex').toString('ascii')
                    }
                    blockFound = block
                }
            }).on('error', function (err) {
                reject(err)
            }).on('close', function () {
                resolve(blockFound)
            })
        })
    }




}

/* ===== Testing ==============================================================|
|  - Self-invoking function to add blocks to chain                             |
|  - Learn more:                                                               |
|   https://scottiestech.info/2014/07/01/javascript-fun-looping-with-a-delay/  |
|                                                                              |
|  * 100 Milliseconds loop = 36,000 blocks per hour                            |
|     (13.89 hours for 500,000 blocks)                                         |
|    Bitcoin blockchain adds 8640 blocks per day                               |
|     ( new block every 10 minutes )                                           |
|  ===========================================================================*/

/*
(function theLoop (i) {
  setTimeout(function () {
    addDataToLevelDB('Testing data');
    if (--i) theLoop(i);
  }, 100);
})(10);*/
