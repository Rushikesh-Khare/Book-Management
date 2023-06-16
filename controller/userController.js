const User = require('../model/userModel');

const createUser = async function (req, res) {
    try {
        const data = req.body;
        if (!data) {
            return res.status(400).send({ status: false, message: "" });
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: "" });
    }

}