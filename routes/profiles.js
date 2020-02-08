const helpers = require('../helpers/util.js');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

module.exports = (pool) => {
    router.get('/', helpers.isLoggedIn, (req, res, next) => {
        const selectQuery = 'SELECT * FROM users WHERE userid = $1';
        const id = [req.session.user.userid];
        pool.query(selectQuery, id, (err, result) => {
            res.render('profile/profile', {
                userData: result.rows[0],
                url : req.url
            });
        })
    });

    router.post('/', helpers.isLoggedIn, (req, res, next) => {
        let password = req.body.password;
        let data = [req.body.email, req.body.position, req.body.isfulltime, req.session.user.userid];
        let updateQuery = 'UPDATE users SET email=$1, position=$2, isfulltime=$3'
        const salt = 8;
        if (password != '') {
            updateQuery += ', password = $5'
            password = bcrypt.hashSync(password, salt);
            data.push(password);
        }
        updateQuery += ' WHERE userid=$4';
        pool.query(updateQuery, data, (err) => {
            if (err) {
                return console.log(err);
            }
            res.redirect('/profiles');
        });
    })
    return router;
}