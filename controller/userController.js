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
            return res.status(400).send({ status: false, message: "enter the data of user" });
        }
        if (!isValid(data.title)) {
            return res.status(400).send({ status: false, message: "title required" });
        }
        if (!["Mr", "Mrs", "Miss"].includes(data.title)) {
            return res.status(400).send({ status: false, message: "title is not valid" });
        }
        if (!isValid(data.name)) {
            return res.status(400).send({ status: false, message: "name is not valid" });
        }
        if (!isValid(data.phone)) {
            return res.status(400).send({ status: false, message: "phone is not valid" });
        }
        if (!isValid(data.email)) {
            return res.status(400).send({ status: false, message: "emai is not valic" });
        }

        //check email is valid or not
        const phoneRegex = /^[a-zA-Z0-9\s\-\.,']+$/u;
        if (!phoneRegex.test(data.phone)) {
            return res.status(400).send({ status: false, message: "invalid phone" });
        }

        //check email is valid or not
        const emailRegex = /^[\w\.-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(data.email)) {
            return res.status(400).send({ status: false, message: "invalid email" });
        }

        const unique = await User.findOne({ phone: data.phone, email: data.email });
        if (unique) {
            return res.status(400).send({ status: false, message: "email or phone already exist" });
        }

        if (!isValid(data.password)) {
            return res.status(400).send({ status: false, message: "password is not valid" });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,15}$/;
        if (passwordRegex.test(data.password)) {
            return res.status(400).send({ status: false, message: "invalid password" });
        }

        if (!data.address) {
            return res.status(400).send({ status: false, message: "adress is required" });
        }
        if (typeof (data.address) != "object") {
            return res.status(400).send({ status: false, message: "invalid address" });
        }

        let { street, city, pincode } = data.address;
        if (!street || !isValid(street)) {
            return res.status(400).send({ status: false, message: "street is invalid " });
        }

        if (!city || !isValid(city)) {
            return res.status(400).send({ status: false, message: "city is invalid" });
        }

        if (!pincode || !isValid(pincode)) {
            return res.status(400).send({ status: false, message: "pincode is invalid" });
        }

        await User.create(data);

        res.status(201).send({ status: true, message: "Success", data: data })
    } catch (error) {
        if (error.message.includes("validation")) {
            return res.status(400).send({ status: false, message: error.message })
        }
        return res.status(500).send({ status: false, message: error });
    }

}
//userlogin api
const userLogin = async function (req, res) {
    try {
        const {
            email,
            password
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: false,
                message: 'Please enter email and password.',
            });
        }

        
        if (!isValid(email) || !isValid(password)) {
            return res.status(400).send({
                status: false,
                message: "email must be valid"
            });
        }

        console.log("line109");
        // Searching the user in the DB
        const user = await User.findOne({
            email
        });

        if (!user) {
            return res.status(404).json({
                status: false,
                message: 'Invalid email or user not found.',
            });
        }


        const token = jwt.sign({
            userId: user._id.toString()
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: '1d',
        });

        res.setHeader("x-api-key", token);

        res.status(200).json({ status: true, data: { "token": token } });

    } catch (error) {
        if (error.message.includes("validation")) {
            return res.status(400).send({ status: false, message: error.message })
        }
        return res.status(500).send({ status: false, message: error });
    }
}

module.exports = { createUser, userLogin };