const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tradeSchema = new Schema({
    
    
    category:{type: String, required:[true, 'Category is required']},
    title:{type: String, required:[true, 'title is required']},
    color:{type: String, required:[true, 'color is required']},
    subCategory:{type: String, required:[true, 'SubCategory is required']},
    description:{type: String, required:[true, 'description is required'],
    minLength: [8, 'Content must contain atleast 8 Characters']},
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    status: { type: String, enum: ['Available', 'Pending', 'Traded']},
    exchanges: {type: Schema.Types.ObjectId, ref: 'Exchange'},
    
},
{timestamps: true}
);


module.exports = mongoose.model('Trade', tradeSchema);



































































// const {v4: uuidv4} = require('uuid');
// const contentDisposition = require("content-disposition");
// const { DateTime} = require("luxon");


// const trades = [
//     {
//         Categoryid: '1',
//         title: 'Office',
//         image:'../images/office.png',
//         subcategories:[
//             {
//             id: '1',
//             color: 'Black',
//             title : 'Wooden table',
//             SubCategory : 'Table',
//             image:'../images/table.jfif',
//             description: 'In good condition. 1 year used and 2 year warranty left.'

//             },
//             {
//             id: '2',
//             color: 'Black',
//             title: 'Plastic chair',
//             color: 'Balck',
//             SubCategory : 'Chair',
//             image:'../images/chair.jfif',
//             description: 'In good condition. Wooden Chair. 1 year used.'
//             }, 
//             {
//             id: '3',
//             color: 'Black',
//             title: 'Electronic Study Lamp',
//             SubCategory : 'Study Lamp',
//             image:'../images/studyLamp.jfif',
//             description: 'In good condition. 1 month used and 2 year warranty left.'
//             },
//             {
//             id: '4',
//             color: 'Black',
//             title: 'Mini laptop stand',
//             SubCategory : 'Laptop Stand',
//             image:'../images/LaptopStand.jfif',
//             description: 'In good condition. 1 month used and 2 year warranty left.'
//             }  
//             ],
//     },

//     {
//         Categoryid: '2',
//         title: 'Bedroom',
//         image:'../images/Bedroom.png',
//         subcategories:[
//             {
//             id: '5',
//             color: 'Black',
//             title : 'Queen size bed',

//             SubCategory : 'Bed',
//             image:'../images/bed.jfif',
//             description: 'In good condition. 1 year used and 2 year warranty left.'
//             },
//             {
//             id: '6',
//             color: 'Black',
//             title: 'Wooden almirah',
//             SubCategory : 'Almirah',
//             image:'../images/Almirah.jfif',
//             description: 'In good condition. 1 year used and 2 year warranty left.'
//             }, 
//             {
//             id: '7',
//             color: 'Black',
//             title: 'Wooden dressing table',
//             SubCategory : 'Dressing table',
//             image:'../images/dressingTable.jfif',
//             description: 'In good condition. 1 year used and 2 year warranty left.'
//             },
//             {
//             id: '8',
//             color: 'Black',
//             title: 'Decor lights',
//             SubCategory : 'Decor',
//             image:'../images/decor.jfif',
//             description: 'In good condition. 1 year used and 2 year warranty left.'
//             }  
//             ],
//     },
//     {
//         Categoryid: '3',
//         title: 'LivingRoom',
//         image:'../images/LivingRoom.png',
//         subcategories:[
//             {
//             id: '9',
//             color: 'Black',
//             title : 'Sofa',
//             SubCategory : 'Sofa set',
//             image:'../images/sofaSet.jfif',
//             description: 'In good condition. 1 year used and 2 year warranty left.'
//             },
//             {
//             id: '10',
//             color: 'Black',
//             title: 'Wooden TV unit',
//             SubCategory : 'TV Unit',
//             image:'../images/TVunit.jfif',
//             description: 'In good condition. 1 year used and 2 year warranty left.'
//             }, 
//             {
//             id: '11',
//             color: 'Black',
//             title: 'Glass Dining table',
//             SubCategory : 'Dining table',
//             image:'../images/DiningTable.jfif',
//             description: 'In good condition. 1 year used and 2 year warranty left.'
//             },
//             {
//             id: '12',
//             color: 'Black',
//             title: 'Wooden table',
//             SubCategory : 'Coffee table',
//             image:'../images/coffeTable.jfif',
//             description: 'In good condition. 1 year used and 2 year warranty left.'
//             }  
//             ],
//     }];




// exports.find = () => trades;

// exports.findTradeById = id =>trades.find(trade=>trade.Categoryid == id)

// exports.findById = id => trades.find(trade=>{
//         for(let i =0; i<trade.subcategories.length;i++){
//             if(trade.subcategories[i].id == id){
//                 sub_cat = {
//                     tradeId:id,
//                     ...trade.subcategories[i]
//                 }
//                 console.log("sub_cat",sub_cat)
//                 return sub_cat
//             }
//         }

// });

// exports.findByCatId = id => trades.find(trade=>{
//     if(trade.id == id){
//         sub_cat = trade.subcategories
//         return sub_cat
//     }
// });

// exports.save =function(trade){
//     let count = 0;
//     for(var key in trades){
//         if(trades[key].title.toLowerCase() == trade.category.toLowerCase()){
//             trade.id = uuidv4();
//             trade.image = '../images/logo2.jpg';
//             delete trade.category;
//             trades[key].subcategories.push(trade);
//             break;
//         }
//         count +=1;
//     }

//     if(count == trades.length){
//         let newtrade = { categoryId :uuidv4()};
//         newtrade.title = trade.category;
//         delete trade.category;
//         newtrade.subcategories = [];
//         trade.id = uuidv4();
//         trade.image = '../images/logo2.jpg';
//         newtrade.subcategories.push(trade);
//         trades.push(newtrade)
//     }
// };

// exports.updateById = function(id, newTrade){
//     console.log(newTrade)
//     for(var key in trades){
        
//         for (let k = 0 ; k < trades[key].subcategories.length; k++){
//            let trade = trades[key].subcategories[k]
//            if(trade.id === id){
            
//                trade.title =newTrade.title;
//                trade.color =newTrade.color;
//                trade.SubCategory = newTrade.SubCategory;
//                trade.description = newTrade.description;
//                console.log("newTrade",trade)
//                return true;
//            }
//         }
//     }
//     return false;
   
// }
// exports.deleteById = function(id){
   
//     for(var key in trades){

//         for (let k = 0 ; k < trades[key].subcategories.length; k++){
//             let index = trades[key].subcategories[k]
//             if(index.id === id){
//                 trades[key].subcategories.splice(k,1);
//                 if(trades[key].subcategories.length === 0){
//                    trades.splice(key,1);
//                 }
//                 return true;
//             }
//         }}
//         return false;
// }

// //  exports.deleteById= function(id){
// //      let index = trades.findIndex(trade=>trade.id ===id);
// //      if(index !== -1){
// //          trades.splice(index,1);
// //          return true;
// //      }
// //      else{
// //          return false;
// //      }
// //      }