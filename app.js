const express          = require('express'),
      app              = express(),
      path             = require('path'),
      mongoose         = require('mongoose'),
      bodyParser       = require('body-parser'),
      expressValidator = require('express-validator');
      methodOverride   = require('method-override'),
      cookieSession    = require('cookie-session'),
      passport         = require('passport'),
      passportSetup    = require('./config/passport-setup');

// Connect to DB
mongoose.connect('mongodb://pollshub:pollshub@ds151963.mlab.com:51963/pollshub')
    .catch(err => console.log(err));

app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: ['asdm3n2323dn3ed2n']
}));

// Intialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

// bodyParser config
app.use(bodyParser.urlencoded({extended: true}));

// Use validator
app.use(expressValidator({
    customValidators: {
        optionNotEmpty: (options) => {
            for (let option of options) {
                if (!option) return false;
            }
            return true;
        }
    }
}));

// Use methodOverride
app.use(methodOverride('_method'));

// Require and use routes
const indexRoutes = require('./routes/index'),
      pollRoutes  = require('./routes/polls'),
      authRoutes  = require('./routes/auth');

app.use('/', indexRoutes);
app.use('/polls', pollRoutes);
app.use('/auth', authRoutes);

// Set view engine
app.set('view engine', 'ejs');

app.listen(8000, 'localhost', () => {
    console.log('Server Started!');
});