const express = require('express'),
	  router  = express.Router(),
	  Poll    = require('../models/poll'),
	  User    = require('../models/user');

const middleware = require('../middleware/index');

router.get('/', (req, res) => {
	console.log(req.user);
	Poll.find({})
		.then(polls => res.render('polls', { polls, user: req.user, title: 'All Polls' }))
		.catch(err => console.log(err));
});

router.get('/new', middleware.authCheck, (req, res) => {
	res.render('new', { user: req.user, title: 'New Poll', errors: req.session.errors });
});

router.post('/', middleware.authCheck, (req, res) => {
	req.check('options', 'Options must not be empty').optionNotEmpty();
	req.check('title', 'Title must be longer than 10 and shorter than 150 characters!').isLength({ min: 10, max: 150 });

	var errors = req.validationErrors();
	if (errors) {
		req.session.errors = errors;
		res.redirect('/polls/new');
	} else {
		req.session.errors = [];
		var optionsArray = [];
		var options = req.body.options;
		for (let i = 0; i < options.length; i++) {
			optionsArray.push({ option: options[i], votes: 0 });
		}
	
	// Create poll
		Poll.create({ title: req.body.title, options: optionsArray, createdBy: req.user.username })
			.then(poll => {
				User.findById(req.user._id)
					.then(user => {
						user.polls.push(poll);
						user.save()
							.then(poll => console.log(poll));
					});
				res.redirect('/polls');
			}).catch(err => console.log(err));
	}
});

router.get('/mypolls', middleware.authCheck, (req, res) => {
	User.findById(req.user._id).populate('polls').exec()
		.then(user => {
			res.render('mypolls', {polls: user.polls, title: 'My Polls', user: req.user});
		});
});	

router.get('/:id', (req, res) => {
	Poll.findById(req.params.id)
		.then(poll => res.render('show', { poll, user: req.user, title: poll.title }))
		.catch(err => console.log(err));
});

router.put('/:id', (req, res) => {
	let alreadyVoted = false;
	Poll.findById(req.params.id)
		.then(poll => {
			poll.voters.forEach(voter => {
				if (req.user.id === String(voter.user) || req.ip === voter.ipAddress) {
					alreadyVoted = true;
				}
			});

			if (alreadyVoted) {
				res.redirect(`/polls/${req.params.id}`);
			} else {
				if (req.body.ownOption) {
					poll.options.push({option: req.body.ownOption, votes: 1});
					poll.voters.push({ user: req.user || null, ipAddress: req.ip });
					poll.save();
				} else {
					for (let i = 0; i < poll.options.length; i++) {
						if (poll.options[i].option == req.body.option) {
							poll.options[i].votes++;
							poll.voters.push({ user: req.user || null, ipAddress: req.ip });
							poll.save();
						}
					}
				}
				res.redirect(`/polls/${req.params.id}`);
			}
		}).catch(err => console.log(err));
});

router.delete('/:id', middleware.authCheck, middleware.checkPollOwnership, (req, res) => {
	Poll.findByIdAndRemove(req.params.id)
		.then(poll => {
			res.redirect('/polls/mypolls');
		});
});

module.exports = router; 