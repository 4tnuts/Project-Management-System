const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(session({secret : 'masuk'}));
router.use(flash());

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
      if (result.rows[0] !== undefined) {
        if(result.rows[0].password == input.password){
          req.flash('berhasil', 'berhasil');
          res.redirect('/profiles');
        }else{
          res.redirect('/');
        }
      } else {
        res.redirect('/');
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