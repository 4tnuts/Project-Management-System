const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({
  extended: false
}));
router.use(bodyParser.json());

module.exports = (pool) => {
  router.get('/', (req, res, next) => {
    let countDataUser = 'SELECT count(*) as total FROM users'
    let params = [];
    const currentPage = req.query.page || 1;
    const limit = 5;
    const offset = (currentPage - 1) * limit;
    let url = req.originalUrl;
    if (!url.includes("page")) {
      url = url.includes("?") ?
        url.replace("?", `?page=${currentPage}&`) :
        `${url}?page=${currentPage}`;
    }
    console.log(url)
    if (req.query.id && req.query.cfid) {
      params.push(`userid = ${req.query.id}`);
    }

    if (req.query.email && req.query.cfemail) {
      params.push(`email = '${req.query.email}'`);
    }

    if (req.query.name && req.query.cfname) {
      params.push(`concat(firstname , ' ' , lastname) LIKE '%${req.query.name}%'`)
    }

    if (req.query.position && req.query.cfposition) {
      params.push(`position = '${req.query.position}'`)
    }

    if (req.query.typeofjob && req.query.cftypeofjob) {
      params.push(`isfulltime = ${req.query.typeofjob}`);
    }

    if (req.query.status && req.query.cfstatus) {
      params.push(`isactive = ${req.query.status}`);
    }

    if (params.length > 0) {
      countDataUser += ' WHERE ' + params.join(' AND ')
    }
    countDataUser.toLowerCase()
    console.log(countDataUser);
    pool.query(countDataUser, (err, totalData) => {
      if (err) return console.error(err);
      const total = totalData.rows[0].total;
      const totalPages = Math.ceil(total / limit)
      let getDataUser = 'SELECT * FROM users';

      if (params.length > 0) {
        getDataUser += ` WHERE ${params.join(' AND ')}`;
      }
      console.log(getDataUser);
      getDataUser += ` ORDER BY userid LIMIT ${limit} OFFSET ${offset}`
      pool.query(getDataUser, (err, result) => {
        if (err) return console.error(err);
        res.render('users/dashboard', result = {
          users: result.rows,
          query: req.query,
          totalPages,
          currentPage,
          url
        });
      })
    })
  });

  router.get('/add', (req, res, err) => {
    res.render('users/add');
  })

  router.post('/add', (req, res, next) => {
    let insertQuery = 'INSERT INTO users(email, password, firstname, lastname, isfulltime, position, isactive, isadmin) VALUES($1, $2, $3, $4, $5, $6, $7, $8)';
    let body = [req.body.email, req.body.password, req.body.firstname, req.body.lastname, req.body.isfulltime, req.body.position, true, false];
    pool.query(insertQuery, body, (err) => {
      if (err) return console.error(err);
      res.redirect('/users/add');
    });
  });

  router.get('/edit/:id', (req, res, next) => {
    const id = [req.params.id];
    let getUserData = 'SELECT userid, email, password, firstname, lastname, isfulltime, position FROM users WHERE userid=$1'
    pool.query(getUserData, id, (err, result) => {
      if (err) return console.error(err);
      res.render('users/edit', result = {
        users: result.rows
      })
    })
  })

  router.post('/edit/:id', (req, res, next) => {
    let queryUpdate = 'UPDATE users SET email = $1, password = $2, firstname = $3, lastname = $4, isfulltime = $5, position = $6 WHERE userid = $7';
    let body = [req.body.email, req.body.password, req.body.firstname, req.body.lastname, req.body.isfulltime, req.body.position, req.params.id];
    pool.query(queryUpdate, body, (err) => {
      if (err) return console.error(err);
      res.redirect(`/users/edit/${req.params.id}`);
    })
  })

  router.get('/activation/:id/:active', (req, res, next) => {
    let deleteQuery = 'UPDATE users SET isactive = ';
    if (req.params.active == 'true') {
      deleteQuery += 'true';
    } else {
      deleteQuery += 'false';
    }
    deleteQuery += ' WHERE userid = $1';
    console.log(deleteQuery);
    let id = [req.params.id];
    pool.query(deleteQuery, id, (err) => {
      if (err) return console.error(err);
      res.redirect('/users')
    })
  })
  return router;
}