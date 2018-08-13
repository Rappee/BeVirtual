var express = require('express');
var models = require('../models');
var router = express.Router();
var sequelize = require('Sequelize');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('dashboard');
});

router.get('/storeconfig', function (req, res, next) {
    models.Store.findAll().then(function (stores) {
        res.render('store-config-select-store', {stores: stores});
    });
});

router.get('/storeconfig/:storeid', function (req, res) {
    models.Store.findById(req.params.storeid).then(function (store) {
        res.render('store-config', {store: store});
    });
});

router.get('/storeconfig/:storeid/openinghours', function (req, res) {
    sequelize.query("SELECT distinct validFrom, validTill FROM open", {type: sequelize.QueryTypes.SELECT})
        .then(periods => {
            console.log(periods);
        })
});


module.exports = router;
