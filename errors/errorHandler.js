const handleCustomError = (err, req,res, next) =>{
    console.log("Customer error handler received: ", err)
    if(err.status && err.msg){
        res.status(err.status).send({msg: err.msg})
    }
    else{
        next(err)
    }
}

const handleDbError = (err, req, res, next) =>{
    if(err.code === "22P02"){
        res.status(400).send({msg: "Bad Request"})
    }
    else if(err.code === "42P01"){
        res.status(404).send({msg:"Table Not Found"})
    }
    else if(err.code === "57P05"){
        res.status().send({msg:"Time Out"})
    }
    else{
        res.status(500).send({msg:"Internal Server Error SQL"})
    }
}

const handleServerError = (err, req, res, next) =>{
    res.stat(500).send({msg: "Internal Server Error Detected"})
}

module.exports = {handleCustomError, handleDbError, handleServerError}