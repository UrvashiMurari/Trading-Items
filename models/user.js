const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');


const userSchema = new Schema({
    firstName: {type: String, required: [true, 'first name is required']},
    lastName: {type: String, required: [true, 'last name is required']},
    email: { type: String, required: [true, 'email address is required'], unique: [true, 'this email address has been used'] },
    password: { type: String, required: [true, 'password is required'] },
    watchTrades: [{type: Schema.Types.ObjectId, ref: 'Trade'}],
    exchangeTrades: [{type: Schema.Types.ObjectId, ref: 'Trade'}],
})

//replace plaintext password with hassed password before saving the document in the database
//pre middleware

userSchema.pre('save',function(next){
    let user = this;
    if(!user.isModified('password'))
        return next();
    bcrypt.hash(user.password,10)
    .then(hash =>{
        user.password = hash;
        next();
    })
    .catch(err=>next(err));
});

userSchema.methods.comparePassword = function(loginPassword) {
    return bcrypt.compare(loginPassword, this.password);
}

module.exports = mongoose.model('User', userSchema);