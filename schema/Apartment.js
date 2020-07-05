const mongoose = require('mongoose');
const Room = require("./Room");

var apartmentSchema = mongoose.Schema({
    name : {
        type : String
    },
    street_number : {
        type : String
    },
    street : {
        type : String
    },
    zipcode : {
        type : String
    },
    city : {
        type : String
    }, 
    rooms : {
        type : Array
    }
},{ timestamps: { createdAt: 'created_at' }
});

module.exports = mongoose.model('Apartment', apartmentSchema);