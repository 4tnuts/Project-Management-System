const bodyParser = require('body-parser');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

router.use(bodyParser.urlencoded({
  extended: false
}))
router.use(bodyParser.json());

module.exports = (pool) => {
  router.get('/', (req, res, next) => {
    res.render('login');
  });

  router.post('/login', (req, res, next) => {
    const input = req.body;
    // const saltRounds = 13;
    let query = 'SELECT * FROM users WHERE email = $1';
    pool.query(query, [input.email], (err, result) => {
      if (err) return res.send(err);
      if (result.rows[0].password == input.password) {
        res.redirect('/profiles');
      } else {
        res.redirect('error')
      }
    })
  });
  return router;
}

// INI UNTUK HASHING PASSWORD NANTI
// bcrypt.hash(input.password, saltRounds, (err, hash) => {
//   bcrypt.compare('12312', hash,  (err, result) => {
//     res.json({hash , result});
//   });
// });