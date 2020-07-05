const Reservation = require("../schema/Reservation");
const Room = require("../schema/Room");

function countDay(date1, date2) {
    return Number((date2.getTime() - date1.getTime()) / (1000 * 3600 * 24)).toFixed(0);
}

function calculatePrice(price, dateIn, dateOut){
    let date1 = new Date(dateIn);
    let date2 = new Date(dateOut);

    let multiplicator = countDay(date1, date2);
    return Number(price * multiplicator).toFixed(0);
}

function validateDate(dateIn, dateOut, reservs) {
    let clientDateIn = new Date(dateIn);
    let clientDateOut = new Date(dateOut);
    for(let i = 0; i < reservs.length; i++){
        for(let y = 0; y < countDay(new Date(reservs[i].dateIn), new Date(reservs[i].dateOut)); y++){
            let reservDateIn = new Date(reservs[i].dateIn);
            reservDateIn.setDate( reservDateIn.getDate() + y);
            console.log(reservDateIn);
            console.log(clientDateIn);
            if(clientDateIn.getTime() === reservDateIn.getTime() 
            || clientDateOut.getTime() === reservDateIn.getTime()){
                return true;
            }
        }
    }
    return false;
}

exports.createReservation = (req, res)=>{
    if(!req.body.client
        || !req.body.room
        || !req.body.dateIn
        || !req.body.dateOut){
        res.status(400).json({"text":"bad request"});
    }else{
        Room.findOne({_id : req.body.room}, (err, room)=>{
            if (err) res.status(500).json({"text":"internal error"});

            let reservation = {
                client : req.body.client,
                room : req.body.room,
                dateIn : req.body.dateIn,
                dateOut : req.body.dateOut,
                finalPrice : calculatePrice(room.price, req.body.dateIn, req.body.dateOut)
            };
            Reservation.find({room : reservation.room}, (err2, reservs)=>{
                if (err2) res.status(500).json({"text":"internal error"});

                if(validateDate(reservation.dateIn, reservation.dateOut, reservs)){
                    res.status(400).json({"error":"logement déjà occupé sur ces dates"});
                }else{
                    Reservation.find({client : reservation.client}, (err3, reservs2)=>{
                        if (err3) res.status(500).json({"text":"internal error"});

                        if(validateDate(reservation.dateIn, reservation.dateOut, reservs2)){
                            res.status(400).json({"error":"le client a déjà une réservation sur ces dates"});
                        }else{
                            let _r = new Reservation(reservation);
                            _r.save((err4, reserv)=>{
                                if (err4) res.status(500).json({"text":"internal error"});

                                res.status(200).json({
                                    "reservation" : reserv
                                })
                            })
                        }
                    });
                }
            });
        })
    }
};

exports.updateReservation = (req, res)=>{
    if(!req.body.reservationId
        || !req.body.key
        || !req.body.value){
        res.status(400).json({"text":"bad request"});
    }else{
        Reservation.findOne({_id : req.body.reservationId}, (err, reserv)=>{
            if (err) res.status(500).json({"text":"internal error"});

            key = req.body.key;
            if (reserv[key] === undefined ){
                res.status(500).json({"text": "wrong key"});
            }else{
                reserv[key] = req.body.value;
                reserv.save(function (err, result) {
                    if(err) res.status(500).json({"text": "internal error"});
        
                    res.status(200).json({
                        "text": "Update OK",
                        "result":result
                    })
                });
            }
        })
    }
};

exports.deleteReservation = (req, res)=>{
    if(!req.body.reservationId){
        res.status(400).json({"text":"bad request"});
    }else{
        Reservation.deleteOne({_id : req.body.reservationId}, (err, reserv)=>{
            if (err) res.status(500).json({"text":"internal error"});

            res.status(200).json({
                "reservation" : reserv
            })
        })
    }
};

exports.getOneReservation = (req, res)=>{
    if(!req.body.reservationId){
        res.status(400).json({"text":"bad request"});
    }else{
        Reservation.findOne({_id : req.body.reservationId}, (err, reserv)=>{
            if (err) res.status(500).json({"text":"internal error"});

            res.status(200).json({
                "reservation" : reserv
            })
        })
    }
};

exports.getAllReservation = (req, res)=>{
    Reservation.find({}, (err, reservs)=>{
        if(err) res.status(500).json({"text":"internal error"});

        res.status(200).json({
            "reservations" : reservs
        })
    })
};

exports.getReservationForOneRoom = (req, res)=>{
    if(!req.body.roomId){
        res.status(400).json({"text":"bad request"});
    }else{
        Reservation.find({room : roomId}, (err, reservs)=>{
            if(err) res.status(500).json({"text":"internal error"});

            res.status(200).json({
                "reservations" : reservs
            })
        });
    }
};