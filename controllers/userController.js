const User = require('../models/user');
const model = require('../models/user');
const session = require('express-session');
const flash = require('connect-flash');
const Trade = require('../models/trade');
const Exchange = require('../models/exchange');
const { MongoCursorInUseError } = require('mongodb');


//const session = require('express-session');

exports.new = (req, res) => {
    if(!req.session.user)
    return res.render('./user/new');
else{
    req.flash('error', 'You are logged in already');
    return res.redirect('/users/profile')
}
};

exports.create = (req, res, next)=>{
    
    let user = new model(req.body);
    if(user.email)
        user.email= user.email.toLowerCase();
    user.save()//insert the document to the database
    .then(user=>{
        req.flash('success', 'You have successfully Signed Up')
         res.redirect('/users/login')
    })
    .catch(err=>{
        if(err.name === 'ValidationError' ) {
            req.flash('error', err.message);  
            return res.redirect('back');
        }

        if(err.code === 11000) {
            req.flash('error', 'Email has been used');  
            return res.redirect('/users/new');
        }
        
        next(err);
    }); 
    
    

    
};

exports.getUserLogin = (req, res, next) => {
    

    return res.render('./user/login');
    
}

exports.login = (req, res, next)=>{
    
    let email = req.body.email;
    if(email)
       email=email.toLowerCase();

    let password = req.body.password;
    model.findOne({ email: email })
    .then(user => {
        if (!user) {
            console.log('wrong email address');
            req.flash('error', 'wrong email address');  
            res.redirect('/users/login');
            } else {
            user.comparePassword(password)
            .then(result=>{
                if(result) {
                    req.session.user = user._id;
                    req.flash('success', 'You have successfully logged in');
                    res.redirect('/users/profile');
            } else {
                req.flash('error', 'wrong password');      
                res.redirect('/users/login');
            }
            });     
        }     
    })
    .catch(err => next(err));
}


exports.profile = (req, res, next)=>{
   //console.log('jjjjjjjjjjjjjjj');
    let id = req.session.user;
    Promise.all([model.findById(id).populate('watchTrades'), Trade.find({author: id})])
    .then(results=>{
        const [user, trades] = results;
        const watchTrades = user.watchTrades;
        let exchangeTrades=new Array();
        // console.log(watchTrades);
        if(trades.length==0){
            return res.render('./user/profile', {user,trades,watchTrades,exchangeTrades});
        }
        let exchangeableTrades=new Array();
        trades.forEach(trade=>{
            if(trade.exchanges!=null ){
                exchangeableTrades.push(trade.exchanges);
            }
        });

        let exchTrades = new Array();
        exchangeableTrades.forEach(trade=>{
            var f1 = Exchange.findById(trade).populate('trade1').populate('trade2').populate('author')
            exchTrades.push(f1);
        });
        Promise.all(exchTrades)
        .then((result)=>{
            
            result.forEach(rr=>{
                if(rr){

                    exchangeTrades.push(rr);
                }
            });
            res.render('./user/profile', {user,trades,watchTrades,exchangeTrades});
        })
        .catch(err=>next(err));
    })
    .catch(err=>next(err));
};


//logout the user

exports.logout =(req,res,next)=>{
    req.session.destroy(err=>{
        if(err)
            return next(err);
        else
            res.redirect('/');
    })
}




exports.signup = (req,res,next) => {
    let user = new User(req.body)
    user.save()
    .then(()=>res.redirect('/users/login'))
    .catch(err=>{
        if(err.name === 'ValidationError'){
            req.flash('error',err.message);
            return res.redirect('/users/new');
        }

        if(err.code === 11000){
            req.flash('error','Email address has been used');
            return res.redirect('/users/new');
        }
        next(err)});
}


exports.exchange = (req, res, next)=>{
    let trade1_id = req.body.trade1_id;
    let trade2_id = req.body.trade2_id;
    let id = req.session.user;
    
    let newExchange = new Exchange({trade1:trade1_id, trade2:trade2_id, author:id});
    newExchange.save()
    .then((exchange)=>{
        if(exchange){
            // console.log("Exchange "+ exchange);
            let trade_id = exchange._id;

            Promise.all([Trade.findById(trade1_id),Trade.findById(trade2_id)])
            .then((result)=>{
                const [trade1,trade2] = result;
                trade1.status = "Pending";
                trade1.exchanges = trade_id;
                trade1.save();
                trade2.status = "Pending";
                trade2.exchanges = trade_id;
                trade2.save();

                return res.redirect('/users/profile');
                
                
            })
            .catch(err=>next(err));
        }
    })
    .catch(err=>next(err));
};

exports.manageOffer = (req, res, next) =>{

    let trade_id = req.params.id;
    let current_user = req.session.user;
    Exchange.findById(trade_id).populate('trade1').populate('trade2').populate('author')
    .then((result)=>{
        
        let trade1 = result.trade1;
        let trade2 = result.trade2;
        let author = result.author;
        res.render('./user/manageOffer',{trade1, trade2, author, current_user,trade_id});
    })
    .catch(err=>next(err));
};

exports.reject = (req, res, next) =>{
    let trade_id = req.params.id;
    Exchange.findById(trade_id).populate('trade1').populate('trade2').populate('author')
    .then((result)=>{
        let trade1_id = result.trade1._id;
        let trade2_id = result.trade2._id;

        Promise.all([Trade.findById(trade1_id),Trade.findById(trade2_id)])
        .then((results)=>{
            const [trade1,trade2] = results;
            trade1.status = "Available";
            trade1.exchanges = null;
            trade1.save();
            trade2.status = "Available";
            trade2.exchanges = null;
            trade2.save();
            return res.redirect('/users/profile');
        })
        .catch(err=>next(err));
    })
    .catch(err=>next(err));
};

exports.accept = (req, res, next) =>{
    console.log('you are here')
    let trade_id = req.params.id;
    Exchange.findById(trade_id).populate('trade1').populate('trade2').populate('author')
    .then((result)=>{
        let trade1_id = result.trade1._id;
        let trade2_id = result.trade2._id;

        Promise.all([Trade.findById(trade1_id),Trade.findById(trade2_id)])
        .then((results)=>{
            const [trade1,trade2] = results;
            trade1.status = "Traded";
            trade1.exchanges = null;
            trade1.save();
            trade2.status = "Traded";
            trade2.exchanges = null;
            trade2.save();
            return res.redirect('/users/profile');
        })
        .catch(err=>next(err));
    })
    .catch(err=>next(err));
};




// exports.signin = (req,res,next)=>{
//     //authenticate user's login request
//     let email = req.body.email;
//     let password = req.body.password;

//     //get the user that matches the email
//     User.findOne({email: email})
//     .then(user=>{
//         if(user){
//              user.comparePassword(password)
//              .then(result=>{
//                  if(result){
//                     req.session.user = user._id; //store users id in session
//                     req.flash('success','You have successfully Logged in');
//                     res.render('./user/profile',{user})
//                  }
//                  else{
                 
//                     req.flash('error','Wrong password');
//                     res.redirect('/users/login')
//                  }
//              })
//         }
//         else{
//             req.flash('error','Wrong email address');
//             res.redirect('/users/login')
//         }
     

//     })
//     .catch(err=>next(err))
// }