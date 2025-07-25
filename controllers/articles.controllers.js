const articles = require("../db/data/test-data/articles");
const fetchArticles = require("../models/articles.models")


const getArticles = (req, res) => { 
    fetchArticles().then((articles) => {
        res.status(200).send({articles: articles})
    })
};

module.exports = getArticles