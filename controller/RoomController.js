const Room = require("../schema/Room");


exports.create = (req, res)=>{
    
};

exports.update = (req, res)=>{

};

exports.delete = (req, res)=>{

};

exports.getone = (req, res)=>{
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

exports.getall = (req, res)=>{
    Room.find({}, (err, rooms)=>{
        if(err) res.status(500).json({"text":"internal error"});

        res.status(200).json({
            "rooms" : rooms
        })
    })
};