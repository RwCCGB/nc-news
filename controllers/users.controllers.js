const users = require("../db/data/test-data/users");
const fetchUsers = require("../models/users.models")


const getUsers = (req, res) => { 
    fetchUsers().then((users) => {
        res.status(200).send({users: users})
    })
};

module.exports = getUsers