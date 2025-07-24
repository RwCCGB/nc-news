const express = require('express');
const getArticles = require("./controllers/articles.controllers.js")

const app = express();

app.get('/api/articles', getArticles)

module.exports = app