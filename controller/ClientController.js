const config = require('../config');
const passwordHash = require("password-hash");
const jwt = require('jwt-simple');
const fs = require('fs');
const Client = require('../schema/Client');


function tokenForUser(client) {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: client.id, iat: timestamp}, config.secret);
}

exports.oneClient = function (req, res) {
    if(!req.body.email){
        res.status(400).json({
            "text": "Bad Request"
        })
    }else{
        Client.findOne({email: req.body.email}, (err, cli)=>{
            if(err) res.status(500).json({"text": "Erreur interne"});
            cli.password = ""
            res.status(200).json({"client":cli});
        })
    }
};

exports.allClient = (req, res)=>{
    Client.find({}, (err, clis)=>{
        if(err) res.status(500).json({"text": "Erreur interne"});

        for(let i=0; i < clis.length ; i++){
            clis[i].password = ""
        }
        res.status(200).json({"client":clis});
    })
};

exports.deleteClient = function (req, res) {
    if(!req.body.email){
        res.status(400).json({
            "text": "Bad Request"
        })
    }else{
        Client.deleteOne({email:req.body.email}, function (err, cli) {
            if(err) res.status(500).json({"text": "Erreur interne"})

            res.status(200).json({
                "text": "Delete OK"
            })
        })
    }
};

exports.updateClient = function(req, res){
    if(!req.body.key || !req.body.value || !req.body.email){
        res.status(400).json({
            "text": "Bad Request"
        })
    }else{
        key = req.body.key;
        Client.findOne({
            email: req.body.email
        }, function (err, client) {
            if (err) {
                res.status(500).json({
                    "text": "Internal Error"
                })
            }
            else if (!client) {
                res.status(401).json({
                    "text": "L'utilisateur n'existe pas"
                })
            }
            else {
                if (client[key] === undefined ){
                    res.status(500).json({"text": "wrong key"});
                }else{
                    Client.updateOne({email : req.body.email}, {$set:{key : req.body.value}}, function (err, cli) {
                        if(err) res.status(500).json({"text": "Erreur interne"})
            
                        res.status(200).json({
                            "text": "Update OK",
                            "result":cli
                        })
                    });
                }
            }
        })
    }
};

exports.login = function (req, res) {
    //console.log(req.body);
    if (!req.body.email || !req.body.password) {
        //Le cas où l'email ou bien le password ne serait pas soumit ou nul
        res.status(400).json({
            "text": "Bad Request"
        })
    } else {
        Client.findOne({
            email: req.body.email
        }, function (err, client) {
            if (err) {
                res.status(500).json({
                    "text": "Internal Error"
                })
            }
            else if (!client) {
                res.status(401).json({
                    "text": "L'utilisateur n'existe pas"
                })
            }
            else {
                if (client.authenticate(req.body.password)) {
                    client.password = "";
                    res.status(200).json({
                        "token": tokenForUser(client),
                        "text": "Authentification réussi",
                        "client":client
                    })
                }
                else {
                    res.status(401).json({
                        "text": "Mot de passe incorrect"
                    })
                }
            }
        })
    }
};
exports.signup = function(req, res) {
    //console.log(req.body);
    if (!req.body.email ||
        !req.body.password ||
        !req.body.firstname ||
        !req.body.lastname ||
        !req.body.birthday ||
        !req.body.nationality) {
        //Le cas où l'email ou bien le password ne serait pas soumit ou nul
        res.status(400).json({
            "text": "Bad Request"
        })
    } else {

        let client = {
            email: req.body.email,
            password : passwordHash.generate(req.body.password),
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            birthday: req.body.birthday,
            nationality : req.body.nationality
        };

        let findClient = new Promise(function (resolve, reject) {
            Client.findOne({
                email: client.email
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
        
        findClient.then(function () {
            let _u = new Client(client);
            _u.save(function (err, client) {
                if (err) {
                    console.log('fail saving');
                    console.log(err);
                    res.status(500).json({
                        "text": "Erreur interne"
                    })
                } else {
                    client.password = "";
                    res.status(200).json({
                        "text": "Succès",
                        "token": tokenForUser(client),
                        "client" : client
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
                        "text": "L'adresse email existe déjà"
                    });
                    break;
                default:
                    res.status(500).json({
                        "text": "Erreur interne"
                    })
            }
        })
    }
};