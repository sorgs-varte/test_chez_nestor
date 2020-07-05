const Reservation = require("../schema/Reservation");

exports.createReservation = (req, res)=>{

};

exports.updateReservation = (req, res)=>{

};

exports.deleteReservation = (req, res)=>{

};

exports.getoneReservation = (req, res)=>{

};

exports.getAllReservation = (req, res)=>{
    Reservation.find({}, (req, reservs)=>{
        if(err) res.status(500).json({"text":"internal error"});

        res.status(200).json({
            "reservations" : reservs
        })
    })
};