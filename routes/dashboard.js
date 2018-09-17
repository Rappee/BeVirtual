var express = require('express');
var router = express.Router();
var db = require('../modules/DB');

/*
 * Dashboard site urls:
 *      /                                               GET
 *      /storeconfig                                    GET
 *      /storeconfig/:storeid                           GET
 *      /storeconfig/:storeid/periods                   GET
 *      /storeconfig/:storeid/products                  GET
 *
 * Data:
 *     /storeconfig/:storeid/data/periods               GET
 *     /storeconfig/:storeid/data/openinghours          GET         (till, from)
 *                                                      POST        (till, from, blocks)
 *     /storeconfig/:storeid/data/period                POST        (set, till, from)
 *                                                      DELETE      (till, from)
 *
 *     /storeconfig/:storeid/data/products              GET
 *     /storeconfig/:storeid/data/products/:id          GET
 *     /storeconfig/:storeid/data/products              POST        (name, StoreId, duration, maxOverlapAtStart, pricePerPerson, minPersons, maxPersons)
 *     /storeconfig/:storeid/data/products/:id          POST        (name, StoreId, duration, maxOverlapAtStart, pricePerPerson, minPersons, maxPersons)
 *     /storeconfig/:storeid/data/products/:id          DELETE
 */

// -----------------------------------------------------------------------------------------
// Pages
// -----------------------------------------------------------------------------------------

router.get('/', function (req, res) {
    res.render('dashboard');
});

router.get('/storeconfig', function (req, res) {
    db.getStores(function (err, data) {
        if(err) { throw err; }
        res.render('store-config-select-store', {stores: data});
    });
});

router.get('/storeconfig/:storeid', function (req, res) {
    db.getStore(req.params.storeid, function (err, data) {
        if(err) { throw err; }
        res.render('store-config', {store: data[0]});
    });
});

router.get('/storeconfig/:storeid/periods', function (req, res) {
    db.getStore(req.params.storeid, function (err, data) {
        if(err) { throw err; }
        res.render('periods', {store: data[0]});
    });
});

router.get('/storeconfig/:storeid/products', function (req, res) {
    db.getStore(req.params.storeid, function (err, data) {
        if(err) { throw err; }
        res.render('products', {store: data[0]});
    });
});


// -----------------------------------------------------------------------------------------
// Data
// -----------------------------------------------------------------------------------------

router.get('/storeconfig/:storeid/data/periods', function (req, res) {
    db.getOpeningPeriods(req.params.storeid, function (err, data) {
        if(err) { throw err; }
        res.send(data);
    });
});

router.get('/storeconfig/:storeid/data/openinghours', function (req, res) {
    db.getOpeningHours(req.params.storeid, req.query.from, req.query.till, function (err, data) {
        if(err) { throw err; }
        res.send(data);
    });
});

router.post('/storeconfig/:storeid/data/openinghours', function (req, res) {
    db.setOpeningHours(req.params.storeid, req.body.validFrom, req.body.validTill, req.body.blocks, function (err, data) {
        if(err) { throw err; }
        res.send("ok");
    });
});

router.delete('/storeconfig/:storeid/data/period', function (req, res) {
    db.deletePeriod(req.params.storeid, req.body.till, req.body.from, function (err, data) {
        if(err) { throw err; }
        res.send("ok");
    });
});

router.post('/storeconfig/:storeid/data/period', function (req, res) {
    if(req.body.set === 'till') {
        db.setTillWhereFrom(req.params.storeid, req.body.till, req.body.from, function (err, data) {
            if(err) { throw err; }
            res.send("ok");
        });
    }
    else if(req.body.set === 'from') {
        db.setFromWhereTill(req.params.storeid, req.body.till, req.body.from, function (err, data) {
            if(err) { throw err; }
            res.send("ok");
        });
    }
});

// get all products
router.get('/storeconfig/:storeid/data/products', function (req, res) {
    db.getProducts(req.params.storeid, function (err, data) {
        if(err) { throw err; }
        res.send(data);
    });
});

//get product by id
router.get('/storeconfig/:storeid/data/products/:id', function (req, res) {
    db.getProduct(req.params.storeid, req.params.id, function (err, data) {
        if(err) { throw err; }
        res.send(data);
    });
});

// add new product  (name, StoreId, duration, maxOverlapAtStart, pricePerPerson, minPersons, maxPersons)
router.post('/storeconfig/:storeid/data/products', function (req, res) {
    db.addProduct(req.body.name, req.params.storeid, req.body.duration, req.body.maxOverlapAtStart, req.body.pricePerPerson, req.body.minPersons, req.body.maxPersons, function (err, data) {
        if(err) { throw err; }
        res.send(data);
    });
});

// update product
router.put('/storeconfig/:storeid/data/products/:id', function (req, res) {
    db.updateProduct(req.params.id, req.body.name, req.params.storeid, req.body.duration, req.body.maxOverlapAtStart, req.body.pricePerPerson, req.body.minPersons, req.body.maxPersons, function (err, data) {
        if(err) { throw err; }
        res.send("ok");
    });
});

// delete product
router.delete('/storeconfig/:storeid/data/products/:id', function (req, res) {
    db.deleteProduct(req.params.id, function (err, data) {
        if(err) { throw err; }
        res.send(data);
    })
});


module.exports = router;
