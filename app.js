const express = require('express');
const {getArticles, getArticlesById, updateArticleVotes} = require("./controllers/articles.controllers.js")
const getTopics = require("./controllers/topics.controller.js")
const getUsers = require("./controllers/users.controllers.js")
const {handleCustomError, handleDbError, handleServerError} = require("./errors/errorHandler.js")
const {getCommentsByArticleId, postCommentById, deleteCommentsById} = require("./controllers/comments.controller.js")
const app = express();

app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api/articles', getArticles)

app.get('/api/users', getUsers)

app.get('/api/articles/:article_id', getArticlesById)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.post('/api/articles/:article_id/comments', postCommentById)

app.patch('/api/articles/:article_id', updateArticleVotes)

app.delete('/api/comments/:comment_id', deleteCommentsById)

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