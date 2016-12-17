var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/about', function(req, res) {
  res.render('about/about', { title: 'About This Project' });
});

module.exports = router;
