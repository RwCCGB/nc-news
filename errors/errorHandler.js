const handleCustomError = (err, req,res, next) =>{
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
    else{
        res.status(500).send({msg:"Internal Server Error SQL"})
    }
}

const handleServerError = (err, req, res, next) =>{
    res.stat(500).send({msg: "Internal Server Error Detected"})
}

module.exports = handleCustomError, handleDbError, handleServerError