const express = require('express');
const {getArticles, getArticlesById} = require("./controllers/articles.controllers.js")
const getTopics = require("./controllers/topics.controller.js")
const getUsers = require("./controllers/users.controllers.js")
const {handleCustomError, handleDbError, handleServerError} = require("./errors/errorHandler.js")
const getCommentsByArticleId = require("./controllers/comments.controller.js")
const app = express();

app.get('/api/topics', getTopics)

app.get('/api/articles', getArticles)

app.get('/api/users', getUsers)

app.get('/api/articles/:article_id', getArticlesById)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

//#region Error Handling
app.use(handleCustomError)
app.use(handleDbError)
app.use(handleServerError)
/*
app.use((err, req, res, next) =>{
    if(err.status){
        res.status(err.status).send({msg: err.msg})
    }
    else{
        next(err)
    }
})

app.use((err, req, res, next) =>{
    if(err.code === 404){
        res.status(err.code).send({msg: "Not Found"})
    }
})

app.use((err, req, res, next) =>{
    if(err.code === 500){
        res.status(err.code).send({msg:"Internal Server Error Detected"})
    }
})
*/
//#endregion

module.exports = app