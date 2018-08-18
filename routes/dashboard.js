var express = require('express');
var router = express.Router();
var db = require('../modules/DB');

/*
 * Dashboard site urls:
 *      /                                           GET
 *      /storeconfig                                GET
 *      /storeconfig/:storeid                       GET
 *      /storeconfig/:storeid/periods               GET
 *      /storeconfig/:storeid/products              GET
 *
 * Data:
 *     /storeconfig/:storeid/data/periods           GET
 *     /storeconfig/:storeid/data/openinghours      GET         (till, from)
 *                                                  POST        (till, from, blocks)
 *     /storeconfig/:storeid/data/period            POST        (set, till, from)
 *                                                  DELETE      (till, from)
 */

// -----------------------------------------------------------------------------------------
// Pages
// -----------------------------------------------------------------------------------------

router.get('/', function (req, res) {
    res.render('dashboard');
});

router.get('/storeconfig', function (req, res) {
    db.getStores(function (err, data) {
        if(err) { console.log(err); }
        res.render('store-config-select-store', {stores: data});
    });
});

router.get('/storeconfig/:storeid', function (req, res) {
    db.getStore(req.params.storeid, function (err, data) {
        if(err) { console.log(err); }
        res.render('store-config', {store: data[0]});
    });
});

router.get('/storeconfig/:storeid/periods', function (req, res) {
    db.getStore(req.params.storeid, function (err, data) {
        if(err) { console.log(err); }
        res.render('periods', {store: data[0]});
    });
});

router.get('/storeconfig/:storeid/products', function (req, res) {
    db.getStore(req.params.storeid, function (err, data) {
        if(err) { console.log(err); }
        res.send("Not implemented yet");
    });
});


// -----------------------------------------------------------------------------------------
// Data
// -----------------------------------------------------------------------------------------

router.get('/storeconfig/:storeid/data/periods', function (req, res) {
    db.getOpeningPeriods(req.params.storeid, function (err, data) {
        if(err) { console.log(err); }
        res.send(data);
    });
});

router.get('/storeconfig/:storeid/data/openinghours', function (req, res) {
    db.getOpeningHours(req.params.storeid, req.query.from, req.query.till, function (err, data) {
        if(err) { console.log(err); }
        res.send(data);
    });
});

router.post('/storeconfig/:storeid/data/openinghours', function (req, res) {
    db.setOpeningHours(req.params.storeid, req.body.validFrom, req.body.validTill, req.body.blocks, function (err, data) {
        if(err) { console.log(err); }
        res.send("ok");
    });
});

router.delete('/storeconfig/:storeid/data/period', function (req, res) {
    db.deletePeriod(req.params.storeid, req.body.till, req.body.from, function (err, data) {
        if(err) { console.log(err); }
        res.send("ok");
    });
});

router.post('/storeconfig/:storeid/data/period', function (req, res) {
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
