const {fetchCommentsByArticleId, postComment} = require("../models/comments.models")

const getCommentsByArticleId = (req, res, next) =>{
    const article_id = Number(req.params.article_id)

    fetchCommentsByArticleId(article_id).then((comments) =>{
        res.status(200).send({comments})
    }).catch((err) => {
        console.log("error in getCommentsByArticleId: ", err)
        next(err)
    })
}

const postCommentById = (req, res, next) =>{
    const {article_id} = req.params
    const {username, body} = req.body

    postComment(article_id, username, body)
        .then((comment) => {
            res.status(201).send({comment})
        }).catch(next)
}
module.exports = {getCommentsByArticleId, postCommentById}