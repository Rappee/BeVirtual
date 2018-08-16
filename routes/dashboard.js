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

router.get('/periods/:storeid', function (req, res) {
    db.getStore(req.params.storeid, function (err, data) {
        if(err) { console.log(err); }
        res.render('periods', {store: data[0]});
    });
});

// data

router.get('/storeconfig/:storeid/getperiods', function (req, res) {
    db.getOpeningPeriods(req.params.storeid, function (err, data) {
        if(err) { console.log(err); }
        res.send(data);
    });
});

// url?from='yyyy-mm-dd'&till='yyyy-mm-dd'
router.get('/storeconfig/:storeid/openinghours', function (req, res) {
    db.getOpeningHours(req.params.storeid, req.query.from, req.query.till, function (err, data) {
        if(err) { console.log(err); }
        res.send(data);
    });
});

router.post('/storeconfig/:storeid/openinghours', function (req, res) {
    db.setOpeningHours(req.params.storeid, req.body.validFrom, req.body.validTill, req.body.blocks, function (err, data) {
        if(err) { console.log(err); }
        res.send("ok");
    });
});

router.post('/storeconfig/:storeid/period/delete', function (req, res) {
    db.deletePeriod(req.params.storeid, req.body.till, req.body.from, function (err, data) {
        if(err) { console.log(err); }
        res.send("ok");
    });
});

router.post('/storeconfig/:storeid/period/update', function (req, res) {
    if(req.body.set === 'till') {
        db.setTillWhereFrom(req.params.storeid, req.body.till, req.body.from, function (err, data) {
            if(err) { console.log(err); }
            res.send("ok");
        });
    }
    else if(req.body.set === 'from') {
        db.setFromWhereTill(req.params.storeid, req.body.till, req.body.from, function (err, data) {
            if(err) { console.log(err); }
            res.send("ok");
        });
    }
});



module.exports = router;
