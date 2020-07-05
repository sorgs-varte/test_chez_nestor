const passport = require('passport');
const Client = require('../schema/Client');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
    // Verify this email and password, call done with the client
    // if it is the correct email and password
    // otherwise, call done with false
    Client.findOne({ email: email}, function(err, client) {
        if (err) { return done(err); }
        if (!client) { return done(null, false); }

        // compare passwords - is `password` equal to client.password?
        client.comparePassword(password, function(err, isMatch) {
            if (err) { return done(err); }
            if (!isMatch) { return done(null, false); }

            return done(null, client);
        });
    });
});

// Setup options for JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
    // See if the client ID in the payload exists in our database
    // If it does, call 'done' with that other
    // otherwise, call done without a client object

    Client.findById(payload.sub, function(err, client) {
        if (err) { return done(err, false); }

        if (client) {
            done(null, client);
        } else {
            done(null, false);
        }
    });
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
