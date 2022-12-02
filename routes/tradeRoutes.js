const express = require('express');
const controller = require('../controllers/tradeController');
const{isLoggedIn, isAuthor, isGuest} = require('../middlewares/auth');
const {validateId} = require('../middlewares/validator')
const {validateTrade, validateResults} = require('../middlewares/validator');
const router = express.Router();
 



//GET /trades: send all trade items to user
router.get('/',controller.index);


//Get /trades/new:send html form for creating new trade item
router.get('/new',isLoggedIn, controller.new);

router.get('/trade/:id', isLoggedIn, controller.trades);

//get /trades/:id: send details of trade identified by id
router.get('/:id',validateId, controller.show);

router.post('/:id', validateId, isLoggedIn, controller.watch);

//get /trades/:id/edit: send html form for editing an existing item
router.get('/:id/edit',validateId,isLoggedIn, isAuthor, controller.edit);

//Post /trades:create a new trade
router.post('/',isLoggedIn, validateTrade, validateResults, controller.create);


//Delete /trades/:id, delete trade identifies by id
router.delete('/:id',validateId,isLoggedIn, isAuthor,controller.delete);


//PUT /trades/:id: update the trade identified by id
router.put('/:id',validateId,isLoggedIn,isAuthor,validateTrade, validateResults,controller.update);


module.exports =router;