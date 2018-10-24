const level = require('level');
const chainDB = './validationRequest';
const db = level(chainDB);


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
                    resolve(JSON.parse(value));
                }

            })
        })
    },

    deleteData: function (key) {
        return new Promise((resolve, reject) => {
            db.del(key, function(err) {
                if (err) {
                    reject('Block ' + key + ' could not be deleted', err);
                }else {
                    resolve('Success')
                }
            })
        })
    }

}