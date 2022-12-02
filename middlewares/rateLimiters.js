const rateLimit =  require("express-rate-limit");

exports.logInLimiter = rateLimit({
    windowMs: 60*1000, //1 minute time
    max:5,
    handler: (req,res,next) =>
    {
        let err = new Error('Too many login requests. Try again later');
        err.status = 429;
        return next(err);
    }
    //message : 'Too many login requests. Try again later '
});

exports.SignUpLimiter = rateLimit({
	windowMs: 60*1000,
	max: 5,
	handler: (req,res,next) =>{
		let err = new Error("Too Many Sign Up requests. Try again later");
		err.status = 429;
		return next(err);
	}
});