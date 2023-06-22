const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { JWT_SECRET_KEY, JWT_EXPIRY } = process.env;
const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};
const createUser = async function (req, res) {
    try {
        const data = req.body;
        if (!data) {
            return res.status(400).send({ status: false, message: "" });
        }
        if (!isValid(data.title)) {
            return res.status(400).send({ status: false, message: "" });
        }
        if (!["Mr", "Mrs", "Miss"].includes(data.title)) {
            return res.status(400).send({ status: false, message: "" });
        }
        if (!isValid(data.name)) {
            return res.status(400).send({ status: false, message: "" });
        }
        if (!isValid(data.phone)) {
            return res.status(400).send({ status: false, message: "" });
        }
        if (!isValid(data.email)) {
            return res.status(400).send({ status: false, message: "" });
        }

        //check email is valid or not
        const phoneRegex = /^[a-zA-Z0-9\s\-\.,']+$/u;
        if (!phoneRegex.test(data.phone)) {
            return res.status(400).send({ status: false, message: "" });
        }

        //check email is valid or not
        const emailRegex = /^[\w\.-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(data.email)) {
            return res.status(400).send({ status: false, message: "" });
        }

        const unique = await User.findOne({ phone: data.phone, email: data.email });
        if (unique) {
            return res.status(400).send({ status: false, message: "" });
        }

        if (!isValid(data.password)) {
            return res.status(400).send({ status: false, message: "" });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,15}$/;
        if (passwordRegex.test(data.password)) {
            return res.status(400).send({ status: false, message: "" });
        }

        if (!data.address) {
            return res.status(400).send({ status: false, message: "" });
        }
        if (typeof (data.address) != "object") {
            return res.status(400).send({ status: false, message: "" });
        }

        let { street, city, pincode } = data.address;
        if (!street || !isValid(street)) {
            return res.status(400).send({ status: false, message: "" });
        }

        if (!city || !isValid(city)) {
            return res.status(400).send({ status: false, message: "" });
        }

        if (!pincode || !isValid(pincode)) {
            return res.status(400).send({ status: false, message: "" });
        }

        await User.create(data);

        res.status(201).send({ status: true, message: "Success", data: data })
    } catch (error) {
        return res.status(500).send({ status: false, message: error });
    }

}
//userlogin api
const userLogin = async function (req, res) {
    try {
        const { email, password } = req.body;
        const data = req.body;
        const findData = await User.findOne({ email: email, password: password });
        if (!findData) {
            return res.status(400).send({ status: false, message: "please enter valid email or password" });
        }
        // const JWT_SECRET = "this-is-protected-key";
        const token = jwt.sign({
            userId: findData._id.toString(),
            name: findData.name
        }, JWT_SECRET_KEY, {
            expiresIn: JWT_EXPIRY
        });
        res.setHeader("x-api-key", token);
        res.status(200).send({ status: true, data: { "token": token } });

    } catch (error) {
        return res.status(500).send({ status: false, message: error });
    }
}

module.exports = { createUser, userLogin };