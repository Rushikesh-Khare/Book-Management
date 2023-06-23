const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
require('dotenv').config();
const {JWT_SECRET_KEY} = process.env;
const Book = require('../model/bookModel')
const { isValidObjectId } = require('mongoose');
const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};
async function auth(req,res,next){
    try {
        let token = req.headers['x-api-key']; 

        if (!token) {
            return res.status(400).send({ status: false, message: "Token must be Present." });
        }

        jwt.verify( token,JWT_SECRET_KEY, function ( err , decodedToken ) {
            if (err) {

                if (err.name === 'JsonWebTokenError') {
                    return res.status(401).send({ status: false, message: "invalid token" });
                }

                if (err.name === 'TokenExpiredError') {
                    return res.status(401).send({ status: false, message: "you are logged out, login again" });
                } else {
                    return res.send({ msg: err.message });
                }
            } else {
                req.decoded = decodedToken
                next()
            }
        });
    } catch (error) {
        res.status(500).send({msg : error.message})
    }
}

async function Authorisation(req,res,next){
    try {
       const decodeId = req.decoded.userId
       const bodyId = req.body.userId
       if (!isValid(bodyId)) {
        return res.status(400).send({ status: false, message: "invalid id" });
    }
    if (!isValidObjectId(bodyId)) {
        return res.status(400).send({ status: false, message: "invalid title" });
    }
    const findUserId = await User.findById(bodyId);
        if(!findUserId) {
            return res.status(404).send({status: false, message: "data does not found according to userId"});
        }
    if(decodeId != bodyId){
        return res.status(401).send({status: false, message: "user id does not match"});
    }

         next()
    } catch (error) {
        res.status(500).send({msg : error.message})
    }
}

async function updateAuthorisation(req,res,next){
    try {
       const decodeId = req.decoded.userId
       const bookId = req.params.bookId
       if (!isValid(bookId)) {
        return res.status(400).send({ status: false, message: "invalid id" });
    }
    if (!isValidObjectId(bookId)) {
        return res.status(400).send({ status: false, message: "book id is invalid" });
    }
    const bId = await Book.findById(bookId);
    if(!bId) {
        return res.status(404).send({status: false, message: "data does not found according to bookId"});
    }

    if(decodeId != bId.userId){
        return res.status(401).send({status: false, message: "user id does not match"});
    }

         next()
    } catch (error) {
        res.status(500).send({msg : error.message})
    }
}



module.exports = {auth,Authorisation,updateAuthorisation}