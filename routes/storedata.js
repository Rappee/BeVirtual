var express = require('express');
var models = require('../models');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('hello');
});

module.exports = router;