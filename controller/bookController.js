const Book = require('../model/bookModel');
const User = require('../model/userModel');
const moment = require('moment');
const { isValidObjectId } = require('mongoose');
const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

const createBook = async function (req, res) {
    try {
        const data = req.body;
        const { title, excerpt, ISBN, category, subcategory, releasedAt } = req.body;
        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: "invalid title" });
        }
        if (!isValid(excerpt)) {
            return res.status(400).send({ status: false, message: "invalid excerpt" });
        }
        if (!isValid(ISBN)) {
            return res.status(400).send({ status: false, message: "invalid ISBN" });
        }
        const isbnRegex = /^(?=(?:\D*\d){13}(?:(?:\D*\d){3})?$)[\d-]+$/g;
        if (!isbnRegex.test(ISBN)) {
            return res.status(400).send({ status: false, message: "invalid ISBN" });
        }
        if (!isValid(subcategory)) {
            return res.status(400).send({ status: false, message: "invalid subcategory" });
        }
        if (!isValid(category)) {
            return res.status(400).send({ status: false, message: "invalid category" });
        }
        if (!isValid(releasedAt)) {
            return res.status(400).send({ status: false, message: "invalid" });
        }
        //find book is already created or not 
        const unique = await Book.findOne({ title: title }, { ISBN: ISBN });
        if (unique) {
            return re.status(400).send({ status: false, message: "Book is already exist" });
        }
        const trimReleasedAt = releasedAt.trim();
        if (moment(trimReleasedAt, "YYYY-MM-DD").format("YYYY-MM-DD") !== trimReleasedAt) {
            return res.status(400).send({ status: false, message: "Please enter the Date in the format of 'YYYY-MM-DD'." });

        }
        const createData = await Book.create(data);
        return res.status(201).send({ status: true, message: "Success", data: createData });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

//GET /books
const getBook = async function (req, res) {
    try {
        const data = req.query
        const { userId, category, subcategory } = data;

        //checking userId is valid objectId or not

        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "userId is not valid" });
        }

        //check userID is exist in userModel or not 
        const findUserId = await User.findById(userId);
        if (!findUserId) {
            return res.status(404).send({ status: false, message: "data does not found according to userId" });
        }

        //find data
        const findData = await Book.find({ ...data, isDeleted: false });
        if (findData.length == 0) {
            return res.status(404).send({ status: false, message: "page does not found" });
        }
        return res.status(200).send({ status: true, data: findData });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

//GET book by path parameter

const getBookByPathParam = async function (req, res) {
    try {
        const bookId = req.params.bookId;

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "userId is not valid" });
        }

        const findData = await Book.findOne({ _id: bookId, isDeleted: false });

        if (!findData) {
            return res.status(404).send({ status: false, message: "page not found" });

        }
        if (findData.reviews === 0) {
            findData.reviews = [];
        }
        return res.status(200).send({ status: true, data: findData });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}



const updateBook = async function (req, res) {
    try {
        const bookId = req.params.bookId
        const { title, excerpt, ISBN, releasedAt } = req.body
        if (!isValidObjectId(title)) {
            return res.status(400).send({ status: false, message: "title is not valid" });
        }
        if (!isValidObjectId(excerpt)) {
            return res.status(400).send({ status: false, message: "excerpt is not valid" });
        }
        if (!isValidObjectId(ISBN)) {
            return res.status(400).send({ status: false, message: "ISBN is not valid" });
        }
        if (!isValidObjectId(releasedAt)) {
            return res.status(400).send({ status: false, message: "releasedAt is not valid" });
        }

        const trimReleasedAt = releasedAt.trim();
        if (moment(trimReleasedAt, "YYYY-MM-DD").format("YYYY-MM-DD") !== trimReleasedAt) {
            return res.status(400).send({ status: false, message: "Please enter the Date in the format of 'YYYY-MM-DD'." });

        }

        //checking the the book is present or not with that bookId

        const findBook = await Book.findOne({ _id: bookId, isDeleted: false });
        if (!findBook) {
            return res.status(404).send({ status: false, message: "data does not found according to bookId" });
        }


        //check userID is exist in userModel or not 
        const updateBook = await Book.findByIdAndUpdate({ bookId }, { $set: { title: title, excerpt: excerpt, ISBN: ISBN, releasedAt: releasedAt } }, { new: true });



        return res.status(200).send({ status: true, data: updateBook });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

const deleteBook = async function (req, res) {
    try {
        const bookId = req.params.bookId

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "userId is not valid" });
        }


        //checking the the book is present or not with that bookId

        const findBook = await Book.findOne({ _id: bookId, isDeleted: false });
        if (!bookBook) {
            return res.status(404).send({ status: false, message: "data does not found according to bookId" });
        }


        //check userID is exist in userModel or not 
        const deleteBook = await Book.findByIdAndUpdate({ bookId }, { $set: { isDeleted: true } }, { new: true });


        return res.status(200).send({ status: true, data: deleteBook });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

module.exports = { createBook, getBook, getBookByPathParam, updateBook,deleteBook};