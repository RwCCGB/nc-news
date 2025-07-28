const db = require("../db/connection")

const fetchArticles = () => { 
    return db.query(
        `SELECT 
            articles.author, 
            articles.title, 
            articles.article_id, 
            articles.topic, 
            articles.created_at, 
            articles.votes, 
            articles.article_img_url, 
            COUNT(comments.comment_id)::INT AS comment_count
        FROM articles
            LEFT JOIN comments
            ON comments.article_id =
                articles.article_id
            GROUP BY articles.article_id
            ORDER BY articles.created_at DESC;
        `).then(({rows}) => {
            return rows
        })
}

const fetchArticleById = (article_id) => {
    return db.query(
        `SELECT 
            author, 
            title, 
            article_id, 
            body, 
            topic, 
            created_at, 
            votes, 
            article_img_url
        FROM articles
        WHERE
            article_id = $1`, [article_id]
    ).then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: "Not Found"})
        }
        return rows[0]
    })
}

const updateArticleVotesById = (article_id, inc_votes) =>{
    if(isNaN(article_id)){
        return Promise.reject({status:400, msg: "Invalid article id"})
    }
    if(typeof inc_votes !== "number"){
        return Promise.reject({status: 400, msg: "Invalid vote type"})
    }
    console.log("article id", article_id, "inc", inc_votes)
    return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`, [inc_votes, article_id])
        .then(({rows}) => {
            if(rows.length === 0){
                return Promise.reject({status: 404, msg: "Article not found"})
            }
            return rows[0]
        })
}

module.exports = {fetchArticles, fetchArticleById, updateArticleVotesById}