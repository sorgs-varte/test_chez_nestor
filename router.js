const routeTest = require('./controller/routeTest');
const ClientController = require('./controller/ClientController');
const ApartmentController = require('./controller/ApartmentController');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const express = require('express');
require('./service/passport');
const requireAuth = passport.authenticate('jwt', { session : false });
const requireSignin = passport.authenticate('local', { session: false });
const fs = require('fs');


module.exports = function (app, io) {

    app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:443');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        res.setHeader('Access-Control-Allow-Credentials', true);

        next();
    });

    app.use(cors());
    app.use(bodyParser({limit: '500mb'}));
    app.use(bodyParser.json({type: '*/*'}));
    app.use(bodyParser.json({limit: '500mb'}));
    app.use(bodyParser.urlencoded({limit: '500mb', extended: true}));

    
    app.get("/test", routeTest.test);
    app.post("/login", ClientController.login);
    
    app.post("/client/create", ClientController.signup);
    app.put("/client/update", requireAuth, ClientController.updateClient);
    app.delete("/client/delete", requireAuth, ClientController.deleteClient);
    app.post("/client/getone", requireAuth, ClientController.oneClient);
    app.get("/client/getall", requireAuth, ClientController.allClient);


    app.get("/apartment/getall", requireAuth, ApartmentController.getAllApartment);
    app.post("/apartment/getone", requireAuth, ApartmentController.getOneApartment);
    app.post("/apartment/create", requireAuth, ApartmentController.createApartment);
    app.put("/apartment/update", requireAuth, ApartmentController.updateApartment);
    app.delete("/apartment/delete", requireAuth, ApartmentController.deleteApartment);

};