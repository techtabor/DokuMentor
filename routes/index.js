const express = require('express');
const router = express.Router()

router.use('/', require('./homepages'));
router.use('/v2', require('./v2'));
router.use('/db', require('./db'));
router.use('/auth', require('./auth'));
router.use('/profile', require('./profile'));

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