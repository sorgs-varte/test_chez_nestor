const Apartement = require("../schema/Apartment");


exports.createApartment = function (req, res) {
    if(!req.body.name 
        || !req.body.street_number 
        || !req.body.street 
        || ! req.body.zipcode
        || !req.body.city){
            res.status(400).json({"text":"bad request"});
    }else{
        let apartment = {
            name : req.body.name,
            street_number : req.body.street_number,
            street : req.body.street,
            zipcode : req.body.zipcode,
            city : req.body.city,
            rooms : []
        };
        let findApartment = new Promise(function (resolve, reject) {
            Apartement.findOne({
                name: apartment.name,
                street_number : apartment.street_number,
                street : apartment.street,
                zipcode : apartment.zipcode,
                city : apartment.city
            }, function (err, result) {
                if (err) {
                    reject(500);
                } else {
                    if (result) {
                        reject(204)
                    } else {
                        resolve(true)
                    }
                }
            })
        });

        findApartment.then(function () {
            let _u = new Apartement(apartment);
            _u.save(function (err, apart) {
                if (err) {
                    console.log('fail saving');
                    console.log(err);
                    res.status(500).json({
                        "text": "Erreur interne"
                    })
                } else {
                    res.status(200).json({
                        "text": "Succès",
                        "apartment" : apart
                    });
                }
            })
        }, function (error) {
            switch (error) {
                case 500:
                    console.log('fail find one');
                    res.status(500).json({
                        "text": "Erreur interne"
                    });
                    break;
                case 204:
                    res.status(204).json({
                        "text": "L'appartement existe déjà"
                    });
                    break;
                default:
                    res.status(500).json({
                        "text": "Erreur interne"
                    })
            }
        });
    }
};

exports.deleteApartment = function (req, res) {
    if(!req.body.apartmentId){
        res.status(400).json({
            "text": "Bad Request"
        })
    }else{
        Apartement.deleteOne({_id : req.body.apartmentId}, function (err, apart) {
            if(err) res.status(500).json({"text": "Erreur interne"})

            res.status(200).json({
                "text": "Delete OK"
            })
        })
    }
};

exports.updateApartment = function (req, res) {
    if(!req.body.key || !req.body.value || !req.body.apartmentId){
        res.status(400).json({
            "text": "Bad Request"
        })
    }else{
        key = req.body.key;
        Apartement.findOne({
            _id : req.body.apartmentId
        }, function (err, apart) {
            if (err) {
                res.status(500).json({
                    "text": "Internal Error"
                })
            }
            else if (!apart) {
                res.status(401).json({
                    "text": "L'utilisateur n'existe pas"
                })
            }
            else {
                if (apart[key] === undefined ){
                    res.status(500).json({"text": "wrong key"});
                }else{
                    apart[key] = req.body.value;
                    apart.save(function (err, result) {
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

exports.getOneApartment = function (req, res) {
    if(!req.body.apartmentId){
        res.status(400).json({"text":"bad request"});
    }else{
        Apartement.findOne({_id : req.body.apartmentId}, (err, apart)=>{
            if(err) res.status(500).json({"text":"internal error"});

            res.status(200).json({
                "apartment" : apart
            });
        });
    }
};

exports.getAllApartment = function (req, res) {
    Apartement.find({}, (err, aparts)=>{
        if(err) res.status(500).json({"text":"internal error"});

        res.status(200).json({
            "apartment" : aparts
        });
    })
};