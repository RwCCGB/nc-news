const articles = require("../db/data/test-data/articles");
const {fetchArticleById, fetchArticles, updateArticleVotesById} = require("../models/articles.models")


const getArticles = (req, res) => { 
    const {sort_by, order, topic} = req.query
    fetchArticles({sort_by, order, topic}).then((articles) => {
        res.status(200).send({articles: articles})
    })
};

const getArticlesById = (req, res, next) => {
    
    const {article_id} = req.params
    if(isNaN(article_id)){
        return next({status: 400, msg: "Invalid article id"})
    }
    fetchArticleById(article_id).then((article) =>{
        if(!article){
            return Promise.reject({status: 404, msg: "Not Found"})
        }
        res.status(200).send({article}).catch(next)
    })
    .catch(next)
}

const updateArticleVotes = (req, res, next)=> {
    const {article_id} = req.params
    const {inc_votes} = req.body

    updateArticleVotesById(article_id, inc_votes)
        .then((article) =>{
            res.status(200).send({article})
        }).catch((err) => {
            next(err)
        })
}

module.exports = {getArticles, getArticlesById, updateArticleVotes}