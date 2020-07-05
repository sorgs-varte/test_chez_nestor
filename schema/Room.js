const mongoose = require('mongoose');

var roomSchema = mongoose.Schema({
    number : {
        type : String
    },
    area : {
        type : Number
    },
    price : {
        type : Number
    }
},{ timestamps: { createdAt: 'created_at' }
});

module.exports = mongoose.model('Room', roomSchema);