const express = require('express');
const { createUser, userLogin } = require('../controller/userController');
const { createBook, getBook, getBookByPathParam, updateBook, deleteBook } = require('../controller/bookController');
const { createReview, updateReview, deleteReview } = require('../controller/reviewController');
const { auth, Authorisation, updateAuthorisation, hashpass } = require('../middleware/authMiddleware');
const router = express.Router();
router.post('/register', createUser);
router.post('/login', userLogin)
router.post('/books', auth, Authorisation, createBook);
router.get('/books', auth, getBook);
router.get('/books/:bookId', auth, getBookByPathParam);
router.put('/books/:bookId', auth, updateAuthorisation, updateBook);
router.delete('/books/:bookId', auth, updateAuthorisation, deleteBook);
router.post('/books/:bookId/review', createReview);
router.put('/books/:bookId/review/:reviewId', updateReview);
router.delete('/books/:bookId/review/:reviewId', deleteReview);
module.exports = router;