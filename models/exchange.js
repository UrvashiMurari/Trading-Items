const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exchangeSchema = new Schema({
	author: {type: Schema.Types.ObjectId, ref:'User'},
    trade1: {type: Schema.Types.ObjectId, ref: 'Trade'},
    trade2: {type: Schema.Types.ObjectId, ref: 'Trade'},
},
{timestamps: true}
);

module.exports = mongoose.model('Exchange', exchangeSchema);