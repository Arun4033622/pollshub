const express = require('express'),
      router  = express.Router();

router.get('/', (req, res) => {
    res.render('index', { user: req.user, title: 'Home' });
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;