const Poll = require('../models/poll');

const middleware = {};

middleware.authCheck = (req, res, next) => {
	if (!req.user) {
		res.redirect('/auth/twitter');
	} else {
		next();
	}
};

middleware.checkPollOwnership = (req, res, next) => {
    Poll.findById(req.params.id)
        .then(poll => {
            if (poll.createdBy === req.user.username) {
                next();
            } else {
                res.redirect('/mypolls');
            }
        });
}

module.exports = middleware;