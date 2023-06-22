const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
require('dotenv').config;
const Book = require('../model/bookModel')
const { isValidObjectId } = require('mongoose');
const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};


async function hashpass(req,res,next){
    try {
        if(!req.body.password){
            res.status(400).send({msg : "password"})
         }
         const pass = await bcrypt.hash(req.body.password,12)
    
         req.body.password = pass

         next()
    } catch (error) {
        res.status(500).send({msg : error.message})
    }
}

async function auth(req,res,next){
    try {
        const token = req.heders.x-api-key
        if(!token){
            res.status(401).send({status : false , msg : "token is absent"})
        }
        const decode = jwt.verify(token,process.env.JWT_KEY) //rush
        if(!decode){
            res.status(400).send({status : false , msg : "not autherized"})
        }
        req.decoded = decode
        
        

         next()
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

    if(decodeId != bodyId){
        return res.status(401).send({status: false, message: "user id does not match"});
    }

         next()
    } catch (error) {
        res.status(500).send({msg : error.message})
    }
}



module.exports = {auth,hashpass,Authorisation,updateAuthorisation}