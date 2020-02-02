const bodyParser = require('body-parser')
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

router.use(bodyParser.urlencoded({
  extended: false
}));
router.use(bodyParser.json());


module.exports = (pool) => {
  router.get('/', (req, res, next) => {
    res.render('login');
  });

  // INI UNTUK HASHING PASSWORD NANTI

  router.post('/login', (req, res, next) => {
    const input = req.body;
    let dataSession = req.session;
    dataSession.user = {};
    let query = 'SELECT * FROM users WHERE email = $1';
    pool.query(query, [input.email], (err, result) => {
      if (err) return console.error(err);
      const password = result.rows[0].password;
      if (result.rows[0] !== undefined) {
        bcrypt.compare(input.password, password, (err, deHashed) => {
          console.log(`ini inputan ${input.password} || ini hasil hashed ${password} || ini hasile dehashed ${deHashed}`)
          if (err) return console.error(err);
          console.log(deHashed);
          if (deHashed) {
            dataSession.user = result.rows[0];
            res.redirect('/projects');
          } else {
            res.redirect('/');
          }
        });
      } else {
        res.redirect('/');
      }
    })
  });
  return router;
}

router.get('/logout', (req, res, next) => {
  let dataSession = req.session;
  dataSession.destroy(err => {
    if (err) res.render(err);
    res.redirect('/');
  })
})