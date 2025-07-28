const db = require("../db/connection")
const comments = require("../db/data/test-data/comments")

const fetchCommentsByArticleId = (article_id) =>{
    if(isNaN(article_id)){
        return Promise.reject({status: 400, msg: "Invalid article id"})
    }
    return db.query(
        `SELECT articles.article_id, comments.comment_id, comments.votes, comments.created_at,  comments.author, comments.body, comments.article_id
        FROM articles articles LEFT JOIN comments comments
        ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        ORDER BY comments.created_at 
        DESC`, [article_id]
    ).then(({rows}) => {
        if(rows.length === 0 || rows[0].article_id === null){
            return Promise.reject({status: 404, msg: "article not found"})
        }
        const allComments = rows.filter((row) => row.comment_id !== null)
        return allComments
    })
}
module.exports = fetchCommentsByArticleId