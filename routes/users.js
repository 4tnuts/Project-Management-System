const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

module.exports = (pool) => {
  router.get('/',  (req, res, next) => {
    let getDataUser = 'SELECT * FROM users'
    pool.query(getDataUser, (err,result) => {
      if (err) return console.error (err);
      res.render('users/dashboard', result = {users: result.rows});
    })
  });

  router.get('/add', (req, res, err) => {
    res.render('users/add');
  })

  router.post('/add', (req, res, next) => { 
    let insertQuery = 'INSERT INTO users(email, password, firstname, lastname, isfulltime, position) VALUES($1, $2, $3, $4, $5, $6)';
    let body = [req.body.email, req.body.password, req.body.firstname, req.body.lastname, req.body.isfulltime, req.body.position];
    pool.query(insertQuery, body, (err) => {
      if (err) return console.error (err);
      res.redirect('/users/add');
    });
  });
  
  router.get('/edit/:id', (req, res, next) => {
    const id = [req.params.id];
    let getUserData = 'SELECT userid, email, password, firstname, lastname, isfulltime, position FROM users WHERE userid=$1'
    pool.query(getUserData, id, (err, result) => {
      if (err) return console.error (err);
      res.render('users/edit', result = {users : result.rows})
    })
  })

  router.post('/edit/:id', (req, res, next) => {
    let queryUpdate = 'UPDATE users SET email = $1, password = $2, firstname = $3, lastname = $4, isfulltime = $5, position = $6 WHERE userid = $7';
    let body = [req.body.email,req.body.password, req.body.firstname, req.body.lastname, req.body.isfulltime, req.body.position, req.params.id];
    pool.query(queryUpdate, body, (err) => {
      if (err) return console.error (err);
      res.redirect(`/users/edit/${req.params.id}`);
    })
  })

  router.get('/delete/:id', (req, res, next) => {
    let deleteQuery = 'DELETE FROM users WHERE userid = $1';
    let id = [req.params.id];
    pool.query(deleteQuery, id, (err) => {
      if(err) return console.error(err);
      res.redirect('/users')
    })
  })
  return router;
}