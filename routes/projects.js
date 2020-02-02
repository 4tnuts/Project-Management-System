const bodyParser = require('body-parser');
const express = require('express');
const router = express.Router();

router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

module.exports = (pool) => {
    router.get('/', (req,res,next) => {
        res.render('projects/dashboard');
    });
    return router;
}