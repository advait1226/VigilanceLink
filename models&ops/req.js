const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reqSchema= new Schema({
    
        requestTime: { type: Date },
        location: {
            coordinates: [ Number ],
            address: { type: String }
        },
        civilianId: { type: String },
        copId: { type: String },
        status: { type: String }
    

}, {timestamps: true});

const Request  = mongoose.model('Request', reqSchema);
// automatically looks for blogs collection, pluralizes it
module.exports= Request;