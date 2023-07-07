const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const copSchema= new Schema({
    userId: {
        type: String,
        required: true,
        trim:true
    },
    // googleId: {
    //     type: String,
    //     required: true
    // },
    
    
    displayName : {
        type: String,
        required: true,
        trim: true                                              
    },
    phone : {
        type: String,
        required: true                                              
    },
    email : {
        type: String,                                             
    },
    earnedRatings : {
            type: Number
    },
    totalRatings :{
        type: Number
    },
    location: {
		type: {
			type: String,
			required: true,
			default: "Point"
		},
		address: { type: String },
		coordinates: [{ type : Number}] 
	}


}, {timestamps: true});


copSchema.index({"location": "2dsphere", userId: 1});

const Cop  = mongoose.model('Cop', copSchema);


module.exports= Cop;