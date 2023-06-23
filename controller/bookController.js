const Book = require('../model/bookModel');
const User = require('../model/userModel');
const Review = require('../model/reviewModel');
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
            return res.status(400).send({ status: false, message: "Please provide a valid book ID." });
        }

        const getBookData = await Book
            .findOne({ _id: bookId, isDeleted: false })
            .select({ __v: 0 });

        if (!getBookData) {
            return res.status(404).send({ status: false, message: "No book exists with this ID or it might be deleted." });
        }

        const reviewData = await Review
            .find({ bookId, isDeleted: false })
            .select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 });

        const reviewCount = reviewData.length;

        const bookDetails = {
            ...getBookData._doc,
            reviewsData: reviewData,
            reviews: reviewCount
        };

        return res.status(200).send({ status: true, message: 'Book Details', data: bookDetails });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}



const updateBook = async function (req, res) {
    try {
        let BookID = req.params.bookId;

        let data = req.body;
        const { title, excerpt, ISBN, releasedAt } = data;

        if (Object.keys(data).length != 0) {

            if (!title && !excerpt && !ISBN && !releasedAt) {
                return res.status(400).send({ status: false, message: "At least one field is required." });
            }

            let updateData = {};

            if (title) {
                if (!isValid(title)) {
                    return res.status(400).send({ status: false, message: "Title is not Valid." });
                }

                const checkTitle = await Book.findOne({ title: title });

                if (checkTitle) {
                    return res.status(400).send({ status: false, message: `The title ${title} is already is in use for a Book.Try another one.` });
                }

                updateData.title = title;
            }

            if (excerpt) {
                if (!isValid(excerpt)) {
                    return res.status(400).send({ status: false, message: "Excerpt is not Valid" });
                }
                updateData.excerpt = excerpt;
            }

            if (ISBN) {
                if (!isValid(ISBN)) {
                    return res.status(400).send({ status: false, message: "ISBN is not valid" });
                }

                if (!validateISBN(ISBN)) {
                    return res.status(400).send({ status: false, message: " Invalid ISBN number it should contain only 13 digits" });
                }

                const checkISBN = await Book.findOne({ ISBN: ISBN });

                if (checkISBN) {
                    return res.status(400).send({ status: false, message: `The ISBN ${ISBN} is already is in use for a Book.Try another one.` });
                }

                updateData.ISBN = ISBN;
            }

            if (releasedAt) {

                if (!isValid(releasedAt)) {
                    return res.status(400).send({ status: false, message: "releasedAt must be in string" });
                }

                if (moment(releasedAt, "YYYY-MM-DD").format("YYYY-MM-DD") !== releasedAt) {
                    return res.status(400).send({ status: false, message: "Please enter the Date in the format of 'YYYY-MM-DD'." });
                }

                updateData.releasedAt = releasedAt;
            }

            const updateBookDetails = await Book.findOneAndUpdate(
                { _id: BookID, isDeleted: false },
                updateData,
                { new: true }
            );

            if (!updateBookDetails) {
                return res.status(404).send({ status: false, message: "No data found for updation." });
            }

            res.status(200).send({ status: true, message: "Success", data: updateBookDetails });
        } else {
            return res.status(400).send({ status: false, message: "Invalid request, body can't be empty." });
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

const deleteBook = async function (req, res) {
    try {
        let bookId = req.params.bookId;

        let deleteByBookId = await Book.findOneAndUpdate(
            { _id: bookId, isDeleted: false },
            { isDeleted: true, deletedAt: Date.now() }
        );

        if (!deleteByBookId) {
            return res.status(404).send({ status: false, message: "Book is already deleted." });
        }

        await Review.updateMany(
            { bookId: bookId, isDeleted: false },
            { isDeleted: true }
        );

        return res.status(200).send({ status: true, message: "Successfully Deleted." })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

module.exports = { createBook, getBook, getBookByPathParam, updateBook, deleteBook };