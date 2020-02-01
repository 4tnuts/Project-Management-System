const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

module.exports = (pool) => {
  router.get('/', function (req, res, next) {
    res.send('respond with a resource');
  });
  return router;
}