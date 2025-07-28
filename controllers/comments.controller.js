const fetchCommentsByArticleId = require("../models/comments.models")

const getCommentsByArticleId = (req, res, next) =>{
    const article_id = Number(req.params.article_id)

    fetchCommentsByArticleId(article_id).then((comments) =>{
        res.status(200).send({comments})
    }).catch((err) => {
        console.log("error in getCommentsByArticleId: ", err)
        next(err)
    })
}
module.exports = getCommentsByArticleId