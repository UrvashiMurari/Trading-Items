const express = require('express');
const controller = require('../controllers/userController');
const {isGuest, isLoggedIn}= require('../middlewares/auth');
const {validateSignIn, validateSignUp, validateResults} = require('../middlewares/validator');
const {logInLimiter, SignUpLimiter} = require('../middlewares/rateLimiters');
const router = express.Router();

//GET /users/new: send html form for creating a new user account
router.get('/new',isGuest, controller.new);

//POST /users: create a new user account
router.post('/', isGuest, SignUpLimiter, validateSignUp, validateResults, controller.create)

//GET /users/login: send html for logging in
router.get('/login',isGuest, controller.getUserLogin);

//POST /users/login: authenticate user's login
router.post('/login', logInLimiter, isGuest, validateSignIn, validateResults, controller.login);

//GET /users/profile: send user's profile page
router.get('/profile',isLoggedIn, controller.profile);

router.post('/profile', isLoggedIn, controller.exchange);

//POST /users/logout: logout a user
router.get('/logout',isLoggedIn, controller.logout)

router.post('/exchange/:id', isLoggedIn, controller.manageOffer);

router.post('/exchange/reject/:id', isLoggedIn, controller.reject);

router.post('/exchange/accept/:id', isLoggedIn, controller.accept);


module.exports = router;