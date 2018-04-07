const express = require('express');
const router = express.Router()

//Az összes elérési út kezelőjének betöltése
router.use('/', require('./homepages'));
router.use('/db', require('./db')());

//require('./database')();

router.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  // error handler
  router.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('pages/error');
});
console.log('This shit is loaded.');

module.exports = router;