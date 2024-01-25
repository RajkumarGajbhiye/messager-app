//development Errors:

const developmentErrors = (err,res)=>{
    res.status(err.statusCode).json({
        status: err.status,
        err,
        message:err.message,
        status:err.stack
    })
}

//production Errors:

const productionErrors = (err,res)=>{
    res.status(err.statusCode).json({
        status: err.status,
        message:err.message
    })
}



//global error handler:

const globalErrorHandling = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'Server Failure'
    if(process.env.NODE_ENV === 'development') developmentErrors(err,res)
    else productionErrors(err,res)
}


module.exports= globalErrorHandling;