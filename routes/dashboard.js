var express = require('express');
var router = express.Router();
var db = require('../modules/DB');

// pages

router.get('/', function (req, res, next) {
    res.render('dashboard');
});

router.get('/storeconfig', function (req, res, next) {
    db.getStores(function (err, data) {
        if(err) { console.log(err); }
        res.render('store-config-select-store', {stores: data});
    });
});

router.get('/storeconfig/:storeid', function (req, res) {
    db.getStore(req.params.storeid, function (err, data) {
        if(err) { console.log(err); }
        res.render('store-config', {store: data});
    });
});

// data

router.get('/storeconfig/:storeid/getperiods', function (req, res) {
    db.getOpeningPeriods(req.params.storeid, function (err, data) {
        if(err) { console.log(err); }
        res.send(data);
    });
});

// ?from='yyyy-mm-dd'&till='yyyy-mm-dd'
router.get('/storeconfig/:storeid/getopeninghours', function (req, res) {
    console.log(req.query.from, req.query.till);
    db.getOpeningHours(req.params.storeid, req.query.from, req.query.till, function (err, data) {
        if(err) { console.log(err); }
        res.send(data);
    });
});


module.exports = router;
