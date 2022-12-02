

// const { title } = require('process');
const model = require ('../models/trade');
const user  =  require('../models/user');
const mongoose = require('mongoose');
const Exchange = require('../models/exchange');



exports.index = (req,res, next)=>{
    model.find()
    .then(trades=>res.render('./trade/index',{trades}))
    .catch(err=>next(err));
    
};

exports.new=(req,res)=>{
    res.render('./trade/new');
};

exports.show = (req, res, next)=>{
    let id = req.params.id;
    
    Promise.all([model.findById(id).populate('author', 'firstname lastName'), user.findById(req.session.user)])
    .then((results)=>{

        const [trade,us] = results;
        if(trade) {
            res.render('./trade/show',{trade,us});
        } 
        else {
            req.flash('error','Cannot find a trade with id ' + id);
            return res.redirect('/');
        }
    })
    .catch(err=>next(err));
    //     if(trade) {
    //     	res.render('./trade/show',{trade});
    //     } 
    //     else {
    //         req.flash('error','Cannot find a trade with id ' + id);
    //     return res.redirect('/');
    //     }
    // })
    // .catch(err => next(err));
};

exports.create=(req,res, next)=>{
    let trade = new model(req.body);  
    trade.author = req.session.user;
    trade.status = "Available";
    trade.exchanges = null;
    
    trade.save()  //insert document to databse
    .then((trade)=>{
        req.flash('success', 'You have successfully set an item for trade');
        res.redirect('/trades');
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            req.flash('error',err.message);
            res.redirect('back');
        }
        next(err);
    });

};








exports.edit = (req, res, next)=>{
    let id = req.params.id;

    // if(!id.match(/^[0-9a-fA-F]{24}$/)){
    //     let err = new Error('Invalid Trade id');
    //     err.status = 400;
    //     return next(err);
    // }
    model.findById(id)
    .then((trade)=>{
        if(trade) {
            res.render('./trade/edit',{trade});
        } 
        else {
        req.flash('error','Cannot find a trade with id ' + id);
        return res.redirect('/');
        }
    })
    .catch(err => next(err));
};


exports.delete = (req, res, next)=>{
    let id = req.params.id;

    model.findById(id)
    .then((trade)=>{
        if(trade) {
            if(trade.exchanges !=null){
                Exchange.findById(trade.exchanges).populate('trade1').populate('trade2')
                .then((exchange)=>{
                    
                    
                    if(id == exchange.trade1._id){
                        
                        Promise.all([model.findById(exchange.trade2._id),model.findByIdAndDelete(id,{useFindAndModify: false})])
                        .then((results)=>{
                            const [trade2,trade] = results;
                            trade2.status= "Available";
                            trade2.exchanges = null;
                            trade2.save();
                            req.flash('success', 'You have successfully deleted trade');
                            res.redirect('/trades');
                        })
                        .catch(err=>next(err));
                    } 
                    else{
                        
                        Promise.all([model.findById(exchange.trade1._id),model.findByIdAndDelete(id,{useFindAndModify: false})])
                        .then((results)=>{
                            const [trade1,equipment] = results;
                            trade1.status= "Available";
                            trade1.exchanges = null;
                            trade1.save();
                            req.flash('success', 'You have successfully deleted trade');
                            res.redirect('/trades');
                        })
                        .catch(err=>next(err));
                    }
                    // res.redirect('/exchange');
                })
                .catch(err=>next(err));
                
            }
            else{
                
                model.findByIdAndDelete(id,{useFindAndModify: false})
                .then((trade)=>{
                    
                    req.flash('success', 'You have successfully deleted trade');
                    res.redirect('/trades');
                })
                .catch(err=>next(err));
            }
        }
        else{
            req.flash('error','Cannot find a trade with id ' + id);
            return res.redirect('/');
        }
    })
    .catch(err=>next(err));
};    

exports.update = (req, res, next)=>{
    let trade = req.body;
    let id = req.params.id;
    console.log(trade)
    // if(!id.match(/^[0-9a-fA-F]{24}$/)){
    //     let err = new Error('Invalid Trade id');
    //     err.status = 400;
    //     return next(err);
    // }

    model.findByIdAndUpdate(id,trade,{useFindAndModify: false, runValidators: true})
    .then((trade)=>{
        if(trade) {
            req.flash('success', 'You have successfully updated trade');
            res.redirect('/trades/'+id);
        } 
        else {
            req.flash('error','Cannot find a trade with id ' + id);
            return res.redirect('/');
        }
    })
    .catch((err) =>{
        if(err.name === 'ValidationError'){
            req.flash('error',err.message);
            res.redirect('back');
        }
           
        next(err);
    });
};





exports.watch = (req,res,next)=>{
    let user_id = req.session.user;
    let trade_id = req.params.id;
    user.findOne({ _id: user_id })
    .then(user=>{
        if(user){
            //user found
            let flag = 1;
            user.watchTrades.forEach(trade => {
                if(trade == trade_id){
                    flag = 0;
                    console.log("Found Delete");
                    user.watchTrades.pull(trade_id);
                    req.flash('success', 'You have unwatched a trade');
                }
            });
            if(flag == 1){
                
                user.watchTrades.push(trade_id);
                req.flash('success', 'You have watched a trade');
            }
            user.save();
        }
        else{
            //user not found
            console.log("User not found");
        }
    })
    .catch(err=>next(err));
    return res.redirect('/users/profile');
};

exports.trades = (req,res,next)=>{
    let user_id = req.session.user;
    let trade2_id = req.params.id;
    model.find({author:user_id})
    .then((trades)=>{
        
        res.render('./user/trades', {trades,trade2_id});
    })
    .catch(err=>{
        next(err);
    });
};