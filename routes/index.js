const express = require('express');
const router = express.Router()

router.use((req, res, next) => {
  res.locals.flashwarning = false;
  next();
});

router.use('/', require('./home'));
router.use('/', require('./newdocument'));
router.use('/auth', require('./auth'));
router.use('/profile', require('./profile'));
router.use('/', require('./advsearch'));
router.use('/rating', require('./rating.js'));

if(process.env.NODE_ENV == 'development') router.use('/dev', require('./dev'));

router.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

router.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('pages/error');
});

console.log('Elérési utak betöltve.');

module.exports = router;