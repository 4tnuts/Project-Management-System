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
router.use(flash());
router.use(session({
secret : 'kampret',
resave : false,
saveUninitialized : true
}));

module.exports = (pool) => {
  router.get('/', (req, res, next) => {
    res.render('login');
  });

  // INI UNTUK HASHING PASSWORD NANTI
// bcrypt.hash(input.password, saltRounds, (err, hash) => {
//   bcrypt.compare('12312', hash,  (err, result) => {
//     res.json({hash , result});
//   });
// });
  router.post('/login', (req, res, next) => {
    const input = req.body;
    let dataSession = req.session;
    dataSession.user = {};
    // const saltRounds = 13;
    let query = 'SELECT * FROM users WHERE email = $1';
    pool.query(query, [input.email], (err, result) => {
      if (err) return res.send(err);
      if (result.rows[0] !== undefined) {
        if(result.rows[0].password == input.password){
          dataSession.user = result.rows[0];
          req.flash('berhasil', 'berhasil');
          res.redirect('/projects');
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

router.get('/logout', (req, res, next) => {
  let dataSession = req.session;
  dataSession.destroy(err => {
    if(err) res.render('error', {err});
    res.redirect('/');
  })
})

