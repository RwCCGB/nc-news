const express = require('express');
const getArticles = require("./controllers/articles.controllers.js")
const getTopics = require("./controllers/topics.controller.js")
const getUsers = require("./controllers/users.controllers.js")


const app = express();

app.get('/api/topics', getTopics)

app.get('/api/articles', getArticles)

app.get('/api/users', getUsers)

module.exports = app