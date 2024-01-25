class ApplicationError extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('5') ? 'Internal Error' : `${statusCode}`.startsWith('4') ? 'Client generated error' : "Somthing wrong happend!";
        this.applicationError = true
        Error.captureStackTrace(this)
    }
}

module.exports= ApplicationError;