const express  = require('express'),
      router   = express.Router(),
      passport = require('passport');

router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/redirect', passport.authenticate('twitter'), (req, res) => {
    res.redirect('/polls');
});

module.exports = router;