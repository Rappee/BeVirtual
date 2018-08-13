var express = require('express');
var router = express.Router();
var db = require('../modules/DB');

/* GET users listing. */
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

router.get('/storeconfig/:storeid/openinghours', function (req, res) {

});


module.exports = router;
