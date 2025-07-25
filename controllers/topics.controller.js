const topics = require("../db/data/test-data/topics");
const fetchTopics = require("../models/topics.models")

const getTopics = (req, res) => { 
    fetchTopics().then((topics) => {
        res.status(200).send({topics: topics})
    })    
};

module.exports = getTopics