const initialValidationWindow = 300
module.exports = {
    initialValidationWindow: function (){ return initialValidationWindow},

    calculateValidationWindow: function (requestValidation) {
                                    var remaining = initialValidationWindow
                                    var t1 = parseInt(new Date().getTime().toString().slice(0, -3));
                                    var t2 = parseInt(requestValidation.requestTimeStamp)
                                    remaining -= t1 - t2;
                                    return remaining;
                                }


}





