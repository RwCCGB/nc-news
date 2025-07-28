const db = require("../db/connection")
const comments = require("../db/data/test-data/comments")

const fetchCommentsByArticleId = (article_id) =>{
    if(isNaN(article_id)){
        return Promise.reject({status: 400, msg: "Invalid article id"})
    }
    return db.query(
        `SELECT 
            articles.article_id, 
            comments.comment_id, 
            comments.votes, 
            comments.created_at,  
            comments.author, 
            comments.body, 
            comments.article_id
        FROM 
            articles articles 
        LEFT JOIN 
            comments comments
        ON 
            articles.article_id = comments.article_id
        WHERE 
            articles.article_id = $1
        ORDER BY 
            comments.created_at 
        DESC`, [article_id]
    ).then(({rows}) => {
        if(rows.length === 0 || rows[0].article_id === null){
            return Promise.reject({status: 404, msg: "article not found"})
        }
        const allComments = rows.filter((row) => row.comment_id !== null)
        return allComments
    })
}

const postComment = (article_id, username, body) => {
    if(isNaN(article_id)){
        return Promise.reject({status: 400, msg: "Invalid article id"})
    }
    if(!username || !body){
        return Promise.reject({status: 400, msg: "Missing username or comment"})
    }
    const checkArticle = db.query(`
        SELECT
            *
        FROM
            articles
        WHERE article_id = $1`, [article_id]
        )
    const checkUser = db.query(`
        SELECT
            *
        FROM
            users
        WHERE 
            username = $1`, [username]
        )
    return Promise.all([checkArticle, checkUser])
        .then(([articleResult, userResult]) =>{
            if(articleResult.rows.length === 0){
                return Promise.reject({status: 404, msg: "Article not found"})
            }
            if(userResult.rows.length === 0){
                return Promise.reject({status: 404, msg: "User not found"})
            }
console.log("All data: ", {username, article_id, body})
            return db.query(
                `INSERT INTO
                    comments (author, article_id, body)
                VALUES (
                    $1, $2, $3
                ) RETURNING *`, [username, article_id, body]
            )
        }).then(({rows}) => rows[0])
}
module.exports = {fetchCommentsByArticleId, postComment}