const mongoose = require('mongoose');

var reservationSchema = mongoose.Schema({
    client : {
        type : String
    },
    room : {
        type : String
    },
    dateIn : {
        type : Date
    }, 
    dateOut : {
        type : Date
    }, 
    finalPrice : {
        type : Number
    }
},{ timestamps: { createdAt: 'created_at' }
});

module.exports = mongoose.model('Reservation', reservationSchema);