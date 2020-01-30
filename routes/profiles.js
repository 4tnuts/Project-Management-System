const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

module.exports= (pool) => {
    router.get('/', (req, res, next) => {
        res.send('ini halaman profile');
    });
    return router;
}