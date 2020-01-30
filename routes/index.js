const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  //test database
  router.get('/', (req, res, next) => {
    let query = ' SELECT * FROM users'
    pool.query(query, (err, result)=>{
      res.json(result.rows)
    })
  });
  return router;
}