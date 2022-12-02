const {body} = require('express-validator');
const {validationResult} = require('express-validator');



exports.validateId = (req, res, next) => {
    let id= req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        req.flash('error','Invalid User ');;
        return res.redirect('/');
    } else {
        return next();
    }
}

exports.validateSignIn = [
    body('email','Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
    body('password','Password must be at least 8 characters and at most 64 characters').isLength({min:8, max:64})
];

exports.validateSignUp = [
    body('firstName','First Name can not be empty').notEmpty().trim().escape(),
    body('lastName','Last Name can not be empty').notEmpty().trim().escape(),
    body('email','Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
    body('password','Password must be at least 8 characters and at most 64 characters').isLength({min:8, max:64})
];

exports.validateTrade = [
    body('title','Trade can not be empty').notEmpty().trim().escape(),
    body('subCategory','Category can not be empty').notEmpty().trim().escape(),
    body('description','Content must be of minimum 10 Characters').notEmpty().trim().escape(),
];

exports.validateResults = (req,res,next)=>{
let errors = validationResult(req);
if(!errors.isEmpty()){
    errors.array().forEach(error=>{
        req.flash('error',error.msg);
    });
    return res.redirect('back');
}
else{
    return next();
}
}