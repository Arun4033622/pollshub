const passport        = require('passport'),
      TwitterStrategy = require('passport-twitter'),
      User            = require('../models/user'),
      keys            = require('./keys');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user);
    });
});

passport.use(
    new TwitterStrategy({
        consumerKey: keys.twitter.consumerKey,
        consumerSecret: keys.twitter.consumerSecret,
        callbackURL: '/auth/twitter/redirect'
    }, (token, tokenSecret, profile, done) => {
        User.findOne({ twitterId: profile.id })
            .then(currentUser => {
                if (currentUser) {
                    done(null, currentUser);
                } else {
                    new User({
                        username: profile.username,
                        twitterId: profile.id
                    }).save().then(newUser => {
                        done(null, newUser);
                    });
                }
            });
    }
));