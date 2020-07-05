const Room = require("../schema/Room");
const Apartment = require("../schema/Apartment");

exports.createRoom = (req, res)=>{
    if(!req.body.number 
        || !req.body.area 
        || !req.body.price
        || !req.body.apartmentId){
            res.status(400).json({"text":"bad request"});
    }else{
        let room = {
            number : req.body.number,
            area : req.body.area,
            price : req.body.price
        };

        let _r = new Room(room);
        _r.save((err, roomRes)=>{
            if(err) res.status(500).json({"text":"internal error"});

            Apartment.updateOne({_id : req.body.apartmentId}, {$push:{rooms : roomRes._id}}, (err, result)=>{
                if(err) res.status(500).json({"text":"internal error"});

                res.status(200).json({
                    "room" : roomRes
                });
            });
        });
    }
};

exports.updateRoom = (req, res)=>{
    if(!req.body.key || !req.body.value || !req.body.roomId){
        res.status(400).json({
            "text": "Bad Request"
        })
    }else{
        key = req.body.key;
        Room.findOne({
            _id : req.body.roomId
        }, function (err, room) {
            if (err) {
                res.status(500).json({
                    "text": "Internal Error"
                })
            }
            else if (!room) {
                res.status(401).json({
                    "text": "L'utilisateur n'existe pas"
                })
            }
            else {
                if (room[key] === undefined ){
                    res.status(500).json({"text": "wrong key"});
                }else{
                    room[key] = req.body.value;
                    room.save(function (err, result) {
                        if(err) res.status(500).json({"text": "Erreur interne"})
            
                        res.status(200).json({
                            "text": "Update OK",
                            "result":result
                        })
                    });
                }
            }
        })
    }
};

exports.deleteRoom = (req, res)=>{
    if(!req.body.roomId){
        res.status(400).json({
            "text": "Bad Request"
        })
    }else{
        Room.deleteOne({_id : req.body.roomId}, function (err, room) {
            if(err) res.status(500).json({"text": "Erreur interne"})

            res.status(200).json({
                "text": "Delete OK"
            })
        })
    }
};

exports.getOneRoom = (req, res)=>{
    if(!req.body.roomId){
        res.status(400).json({"text":"bad request"});
    }else{
        Room.findOne({_id:req.body.roomId}, (err, room)=>{
            if (err) res.status(500).json({"text":"internal error"});

            res.status(200).json({
                "room": room
            });
        })
    }
};

exports.getAllRoom = (req, res)=>{
    Room.find({}, (err, rooms)=>{
        if(err) res.status(500).json({"text":"internal error"});

        res.status(200).json({
            "rooms" : rooms
        })
    })
};