const express = require('express');
const getArticles = require("./controllers/articles.controllers.js")
const getTopics = require("./controllers/topics.controller.js")

const app = express();

app.get('/api/topics', getTopics)

app.get('/api/articles', getArticles)

module.exports = app