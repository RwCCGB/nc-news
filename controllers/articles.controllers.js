const articles = require("../db/data/test-data/articles");
const articlesCalls = require("../models/articles.models")

/*
const getArticles = (req, res) => { 
    articlesCalls.fetchArticles().then((articles) => {
        res.status(200).send({articles: articles})
    })
};
*/

const getArticles = (req, res) => {
    articlesCalls.fetchArticlesSortedJOIN().then((articles) => {
        res.status(200).send({articles: articles})
    })
}

module.exports = getArticles